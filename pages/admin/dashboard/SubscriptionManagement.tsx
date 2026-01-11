import React, { useState } from 'react';
import { db } from '../../../services/db';
import { Plan, SubscriptionType } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { Plus, Check, X, Trash2 } from 'lucide-react';

const SubscriptionManagement: React.FC = () => {
    const { user } = useAuth();
    const [plans, setPlans] = useState<Plan[]>(db.plans.getAll());
    const [isCreating, setIsCreating] = useState(false);
    const [newPlan, setNewPlan] = useState<Partial<Plan>>({
        name: '',
        type: SubscriptionType.CLASS_WISE,
        price: 500,
        durationDays: 365,
        description: '',
        active: true
    });

    const handleRefresh = () => setPlans(db.plans.getAll());

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        const plan: Plan = {
            id: `plan-${Date.now()}`,
            ...newPlan as any
        };
        db.plans.create(plan, user?.id || 'admin');
        setIsCreating(false);
        handleRefresh();
    };

    const handleToggleActive = (plan: Plan) => {
        db.plans.update(plan.id, { active: !plan.active }, user?.id || 'admin');
        handleRefresh();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Subscription Plans</h2>
                <button onClick={() => setIsCreating(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
                    <Plus size={16} /> Create Plan
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map(plan => (
                    <div key={plan.id} className={`bg-white rounded-xl shadow-sm border p-6 relative ${plan.active ? 'border-slate-200' : 'border-slate-100 opacity-70'}`}>
                        {!plan.active && <div className="absolute top-4 right-4 bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">INACTIVE</div>}
                        
                        <h3 className="font-bold text-lg text-slate-800 mb-1">{plan.name}</h3>
                        <p className="text-sm text-slate-500 mb-4 h-10">{plan.description}</p>
                        
                        <div className="text-3xl font-bold text-blue-600 mb-6">₹ {plan.price}</div>
                        
                        <div className="space-y-2 text-sm text-slate-600 mb-6">
                            <div className="flex justify-between border-b pb-2">
                                <span>Type</span>
                                <span className="font-medium">{plan.type}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span>Duration</span>
                                <span className="font-medium">{plan.durationDays} Days</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => handleToggleActive(plan)}
                            className={`w-full py-2 rounded font-medium transition-colors ${plan.active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                        >
                            {plan.active ? 'Deactivate Plan' : 'Activate Plan'}
                        </button>
                    </div>
                ))}
            </div>

            {isCreating && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">New Subscription Plan</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Plan Name</label>
                                <input required type="text" className="w-full border p-2 rounded mt-1" value={newPlan.name} onChange={e => setNewPlan({...newPlan, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Description</label>
                                <input required type="text" className="w-full border p-2 rounded mt-1" value={newPlan.description} onChange={e => setNewPlan({...newPlan, description: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Type</label>
                                    <select className="w-full border p-2 rounded mt-1" value={newPlan.type} onChange={e => setNewPlan({...newPlan, type: e.target.value as SubscriptionType})}>
                                        <option value={SubscriptionType.CLASS_WISE}>Class Wise</option>
                                        <option value={SubscriptionType.OVERALL}>Overall</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Price (₹)</label>
                                    <input required type="number" className="w-full border p-2 rounded mt-1" value={newPlan.price} onChange={e => setNewPlan({...newPlan, price: Number(e.target.value)})} />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsCreating(false)} className="text-slate-500">Cancel</button>
                                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionManagement;
