from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import logging
import json
import os
from confluent_kafka import Producer

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="WiseMed PACS Gateway", version="0.1.0")

# Kafka Configuration
KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "redpanda:9092")
KAFKA_TOPIC_EXAM_CREATED = "exam.created"

conf = {'bootstrap.servers': KAFKA_BOOTSTRAP_SERVERS}
producer = Producer(conf)


def delivery_report(err, msg):
    """ Called once for each message produced to indicate delivery result.
        Triggered by poll() or flush(). """
    if err is not None:
        logger.error(f'Message delivery failed: {err}')
    else:
        logger.info(f'Message delivered to {msg.topic()} [{msg.partition()}]')


class OrthancWebhookPayload(BaseModel):
    instanceId: str


@app.get("/healthz")
async def health_check():
    return {"status": "ok", "service": "pacs-gw-service"}


@app.get("/hello")
async def hello():
    return {"message": "Hello from PACS Gateway"}


@app.post("/webhook/orthanc")
async def orthanc_webhook(payload: OrthancWebhookPayload):
    """
    Receive notification from Orthanc when a new instance is stored.
    Publish an event to Kafka.
    """
    logger.info(f"Received webhook from Orthanc: {payload}")

    # Construct event message
    event = {
        "eventType": "ExamCreated",
        "source": "orthanc",
        "data": {
            "instanceId": payload.instanceId,
            # In a real scenario, we might query Orthanc here to get
            # more metadata

            # (PatientID, etc.).
            # For PoC, we just pass the ID.

        }
    }

    try:
        # Produce message to Kafka
        producer.produce(
            KAFKA_TOPIC_EXAM_CREATED,
            key=payload.instanceId.encode('utf-8'),
            value=json.dumps(event).encode('utf-8'),
            callback=delivery_report
        )
        producer.poll(0)  # Trigger delivery report callback
        logger.info(f"Published event to {KAFKA_TOPIC_EXAM_CREATED}")
        return {"status": "processed", "instanceId": payload.instanceId}
    except Exception as e:
        logger.error(f"Failed to publish event: {e}")
        raise HTTPException(status_code=500, detail="Failed to process event")
