'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { UserPlus, Save, User, Shield, Phone } from 'lucide-react';

export default function PatientRegistrationPage() {
    const [formData, setFormData] = useState({
        name: '',
        gender: 'male',
        birthDate: '',
        phone: '',
        idCard: '',
        address: '',
        emergencyContact: '',
        emergencyPhone: '',
        insuranceType: 'basic',
        insuranceNumber: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('患者登记成功！(模拟)');
    };

    const inputClass = "w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-500";
    const labelClass = "block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300";

    return (
        <div className="p-8 max-w-[1400px] mx-auto">
            <div className="mb-10">
                <h1 className="flex items-center gap-4 text-4xl font-bold text-gray-900 dark:text-white mb-3">
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <UserPlus size={36} className="text-primary" />
                    </div>
                    患者登记
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 ml-[68px]">
                    录入新患者基本信息、医保信息及紧急联系人
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Basic Info */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
                            <CardTitle className="flex items-center gap-3 text-xl">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <User size={22} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                基本信息
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>姓名 <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        placeholder="请输入患者姓名"
                                        className={inputClass}
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>性别 <span className="text-red-500">*</span></label>
                                    <select
                                        name="gender"
                                        className={inputClass}
                                        value={formData.gender}
                                        onChange={handleChange}
                                    >
                                        <option value="male">男</option>
                                        <option value="female">女</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>出生日期 <span className="text-red-500">*</span></label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        required
                                        className={inputClass}
                                        value={formData.birthDate}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>联系电话 <span className="text-red-500">*</span></label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        placeholder="请输入手机号码"
                                        className={inputClass}
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>身份证号 <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="idCard"
                                    required
                                    placeholder="请输入18位身份证号"
                                    className={inputClass}
                                    value={formData.idCard}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>居住地址</label>
                                <textarea
                                    name="address"
                                    rows={4}
                                    placeholder="请输入详细居住地址"
                                    className={inputClass}
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-8">
                        {/* Insurance Info */}
                        <Card>
                            <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                        <Shield size={22} className="text-green-600 dark:text-green-400" />
                                    </div>
                                    医保信息
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div>
                                    <label className={labelClass}>医保类型</label>
                                    <select
                                        name="insuranceType"
                                        className={inputClass}
                                        value={formData.insuranceType}
                                        onChange={handleChange}
                                    >
                                        <option value="basic">城镇职工医保</option>
                                        <option value="resident">城乡居民医保</option>
                                        <option value="commercial">商业保险</option>
                                        <option value="self">自费</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>医保卡号</label>
                                    <input
                                        type="text"
                                        name="insuranceNumber"
                                        placeholder="请输入医保卡号"
                                        className={inputClass}
                                        value={formData.insuranceNumber}
                                        onChange={handleChange}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Emergency Contact */}
                        <Card>
                            <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                        <Phone size={22} className="text-orange-600 dark:text-orange-400" />
                                    </div>
                                    紧急联系人
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div>
                                    <label className={labelClass}>联系人姓名 <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="emergencyContact"
                                        required
                                        placeholder="请输入联系人姓名"
                                        className={inputClass}
                                        value={formData.emergencyContact}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>联系电话 <span className="text-red-500">*</span></label>
                                    <input
                                        type="tel"
                                        name="emergencyPhone"
                                        required
                                        placeholder="请输入联系电话"
                                        className={inputClass}
                                        value={formData.emergencyPhone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="mt-10 flex justify-end gap-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                    <Button type="button" variant="outline" onClick={() => window.history.back()} className="px-8 py-3 text-base">
                        取消
                    </Button>
                    <Button type="submit" className="px-10 py-3 text-base font-semibold">
                        <Save size={20} className="mr-2" />
                        保存档案
                    </Button>
                </div>
            </form>
        </div>
    );
}
