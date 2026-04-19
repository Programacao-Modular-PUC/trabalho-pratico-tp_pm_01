import React, { useState } from 'react';
import {
    Settings as SettingsIcon,
    Bell,
    Lock,
    Eye,
    Shield,
    CreditCard,
    Globe,
    Save,
    ChevronRight
} from 'lucide-react';

function Settings() {
    const [settings, setSettings] = useState({
        notifications: {
            email: true,
            sms: true,
            reservations: true,
            reviews: false,
        },
        privacy: {
            showProfile: true,
            allowMessages: true,
            showPhoneNumber: false,
        },
        payments: {
            autoAccept: true,
            instantTransfer: false,
        }
    });

    const [savedMessage, setSavedMessage] = useState(false);

    const handleToggle = (category, setting) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [setting]: !prev[category][setting]
            }
        }));
    };

    const handleSave = () => {
        setSavedMessage(true);
        setTimeout(() => setSavedMessage(false), 3000);
    };

    return (
        <div className="bg-gradient-to-br from-slate-900 via-black to-slate-900 pt-8 pb-12 min-h-screen">
            <div className="max-w-3xl mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <SettingsIcon className="w-8 h-8 text-amber-500" />
                        <h1 className="text-4xl font-black text-white">Configurações</h1>
                    </div>
                    <p className="text-gray-400">Personalize sua experiência e mude preferências</p>
                </div>

                {/* Success Message */}
                {savedMessage && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-400 font-semibold">Configurações salvas com sucesso!</span>
                    </div>
                )}

                {/* Notifications Section */}
                <div className="mb-6 bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl p-6 hover:border-amber-500/20 transition">
                    <div className="flex items-center gap-3 mb-6">
                        <Bell className="w-6 h-6 text-amber-500" />
                        <h2 className="text-xl font-bold text-white">Notificações</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-700/20 rounded-lg">
                            <div>
                                <p className="text-white font-semibold">Notificações por Email</p>
                                <p className="text-gray-400 text-sm">Receba atualizações por email</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.email}
                                    onChange={() => handleToggle('notifications', 'email')}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-700/20 rounded-lg">
                            <div>
                                <p className="text-white font-semibold">Notificações por SMS</p>
                                <p className="text-gray-400 text-sm">Receba mensagens de texto urgentes</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.sms}
                                    onChange={() => handleToggle('notifications', 'sms')}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-700/20 rounded-lg">
                            <div>
                                <p className="text-white font-semibold">Reservas e Confirmações</p>
                                <p className="text-gray-400 text-sm">Notificações sobre suas reservas</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.reservations}
                                    onChange={() => handleToggle('notifications', 'reservations')}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-700/20 rounded-lg">
                            <div>
                                <p className="text-white font-semibold">Avaliações e Reviews</p>
                                <p className="text-gray-400 text-sm">Notificações quando receber avaliações</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.reviews}
                                    onChange={() => handleToggle('notifications', 'reviews')}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Privacy Section */}
                <div className="mb-6 bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl p-6 hover:border-amber-500/20 transition">
                    <div className="flex items-center gap-3 mb-6">
                        <Shield className="w-6 h-6 text-amber-500" />
                        <h2 className="text-xl font-bold text-white">Privacidade</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-700/20 rounded-lg">
                            <div>
                                <p className="text-white font-semibold">Mostrar Perfil Publicamente</p>
                                <p className="text-gray-400 text-sm">Seu perfil será visível para hóspedes</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.privacy.showProfile}
                                    onChange={() => handleToggle('privacy', 'showProfile')}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-700/20 rounded-lg">
                            <div>
                                <p className="text-white font-semibold">Permitir Mensagens</p>
                                <p className="text-gray-400 text-sm">Hóspedes podem enviar mensagens antes da reserva</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.privacy.allowMessages}
                                    onChange={() => handleToggle('privacy', 'allowMessages')}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-700/20 rounded-lg">
                            <div>
                                <p className="text-white font-semibold">Mostrar Telefone</p>
                                <p className="text-gray-400 text-sm">Exibir seu número de telefone publicamente</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.privacy.showPhoneNumber}
                                    onChange={() => handleToggle('privacy', 'showPhoneNumber')}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Payments Section */}
                <div className="mb-6 bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl p-6 hover:border-amber-500/20 transition">
                    <div className="flex items-center gap-3 mb-6">
                        <CreditCard className="w-6 h-6 text-amber-500" />
                        <h2 className="text-xl font-bold text-white">Pagamentos</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-700/20 rounded-lg">
                            <div>
                                <p className="text-white font-semibold">Aceitar Reservas Automaticamente</p>
                                <p className="text-gray-400 text-sm">Aceitar confirmação instantânea de hóspedes</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.payments.autoAccept}
                                    onChange={() => handleToggle('payments', 'autoAccept')}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-700/20 rounded-lg">
                            <div>
                                <p className="text-white font-semibold">Transferência Instantânea</p>
                                <p className="text-gray-400 text-sm">Receba pagamentos mais rapidamente</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.payments.instantTransfer}
                                    onChange={() => handleToggle('payments', 'instantTransfer')}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
                >
                    <Save className="w-5 h-5" />
                    Salvar Configurações
                </button>
            </div>
        </div>
    );
}

export default Settings;
