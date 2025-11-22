import dicomParser from 'dicom-parser';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneMath from 'cornerstone-math';
import * as cornerstoneTools from 'cornerstone-tools';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import Hammer from 'hammerjs';

export default function initCornerstone() {
    // Avoid re-initialization
    if ((window as any).cornerstoneInitialized) {
        return;
    }

    // External dependencies
    cornerstoneTools.external.cornerstone = cornerstone;
    cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
    cornerstoneTools.external.Hammer = Hammer;
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

    // Configure WADO Image Loader
    cornerstoneWADOImageLoader.configure({
        beforeSend: function (xhr: XMLHttpRequest) {
            // Add custom headers here (e.g. auth tokens)
            // const token = localStorage.getItem('token');
            // if (token) {
            //   xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            // }
        },
    });

    // Configure Web Workers
    const config = {
        maxWebWorkers: navigator.hardwareConcurrency || 1,
        startWebWorkersOnDemand: true,
        taskConfiguration: {
            decodeTask: {
                initializeCodecsOnStartup: false,
                usePDFJS: false,
                strict: false,
            },
        },
        webWorkerPath: '/cornerstone/web-worker.js',
    };

    cornerstoneWADOImageLoader.webWorkerManager.initialize(config);

    // Initialize Tools
    cornerstoneTools.init({
        showSVGCursors: true,
        globalToolSyncEnabled: true,
    });

    // Add Tools
    const ZoomTool = cornerstoneTools.ZoomTool;
    const PanTool = cornerstoneTools.PanTool;
    const WwwcTool = cornerstoneTools.WwwcTool;
    const LengthTool = cornerstoneTools.LengthTool;
    const ProbeTool = cornerstoneTools.ProbeTool;
    const RectangleRoiTool = cornerstoneTools.RectangleRoiTool;
    const EllipticalRoiTool = cornerstoneTools.EllipticalRoiTool;
    const StackScrollMouseWheelTool = cornerstoneTools.StackScrollMouseWheelTool;

    cornerstoneTools.addTool(ZoomTool);
    cornerstoneTools.addTool(PanTool);
    cornerstoneTools.addTool(WwwcTool);
    cornerstoneTools.addTool(LengthTool);
    cornerstoneTools.addTool(ProbeTool);
    cornerstoneTools.addTool(RectangleRoiTool);
    cornerstoneTools.addTool(EllipticalRoiTool);
    cornerstoneTools.addTool(StackScrollMouseWheelTool);

    // Set initial state
    cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 }); // Left Click
    cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 2 }); // Middle Click
    cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 4 }); // Right Click
    cornerstoneTools.setToolActive('StackScrollMouseWheel', {});

    (window as any).cornerstoneInitialized = true;
    console.log('Cornerstone initialized');
}
