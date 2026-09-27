import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, ChevronUp, ChevronDown, Package, X, Save, Check, Star, Loader } from 'lucide-react';
import { api } from '../api';

const ICON_OPTIONS = ['globe', 'smartphone', 'monitor', 'gamepad-2', 'code', 'layout', 'server', 'cpu'];

function PlanForm({ plan, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: plan?.name || '',
    price: plan?.price || '',
    currency: plan?.currency || 'INR',
    billing_type: plan?.billing_type || 'one-time',
    features: (plan?.features || []).join('\n'),
    highlighted: plan?.highlighted || false,
  });
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        ...form,
        features: form.features.split('\n').map(s => s.trim()).filter(Boolean),
        highlighted: form.highlighted ? 1 : 0,
      });
    } finally {
      setSaving(false);
    }
  };

  const inp = {
    width: '100%',
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-heading)',
    fontSize: '0.88rem',
    fontFamily: 'var(--font-sans)',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-2)', marginBottom: 6 }}>Plan Name</label>
          <input style={inp} value={form.name} onChange={set('name')} placeholder="e.g. Starter" />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-2)', marginBottom: 6 }}>Price</label>
          <input style={inp} value={form.price} onChange={set('price')} placeholder="e.g. 15,000 or Custom" />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-2)', marginBottom: 6 }}>Currency</label>
          <select style={{ ...inp, cursor: 'pointer' }} value={form.currency} onChange={set('currency')}>
            <option value="INR" style={{ background: '#0f0c1a' }}>INR (₹)</option>
            <option value="USD" style={{ background: '#0f0c1a' }}>USD ($)</option>
          </select>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-2)', marginBottom: 6 }}>Billing Type</label>
          <select style={{ ...inp, cursor: 'pointer' }} value={form.billing_type} onChange={set('billing_type')}>
            <option value="one-time" style={{ background: '#0f0c1a' }}>One-time</option>
            <option value="hourly" style={{ background: '#0f0c1a' }}>Hourly</option>
            <option value="monthly" style={{ background: '#0f0c1a' }}>Monthly</option>
            <option value="quote" style={{ background: '#0f0c1a' }}>Contact for quote</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 24 }}>
          <input
            type="checkbox"
            id={`highlighted-${plan?.id || 'new'}`}
            checked={form.highlighted}
            onChange={e => setForm(f => ({ ...f, highlighted: e.target.checked }))}
            style={{ width: 16, height: 16, accentColor: 'var(--accent)', cursor: 'pointer' }}
          />
          <label htmlFor={`highlighted-${plan?.id || 'new'}`} style={{ fontSize: '0.85rem', color: 'var(--text-heading)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Star size={14} color="var(--accent)" /> Mark as popular
          </label>
        </div>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-2)', marginBottom: 6 }}>Features (one per line)</label>
        <textarea
          style={{ ...inp, resize: 'vertical', minHeight: 90 }}
          value={form.features}
          onChange={set('features')}
          placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
        />
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button onClick={onCancel} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          <X size={14} /> Cancel
        </button>
        <button onClick={handleSave} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} disabled={saving}>
          {saving ? <Loader size={14} /> : <Save size={14} />}
          Save Plan
        </button>
      </div>
    </div>
  );
}

function ServiceCard({ service, onRefresh }) {
  const [expanded, setExpanded] = useState(false);
  const [editingService, setEditingService] = useState(false);
  const [editForm, setEditForm] = useState({ name: service.name, description: service.description, icon: service.icon, is_active: service.is_active });
  const [addingPlan, setAddingPlan] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const setE = (k) => (e) => setEditForm(f => ({ ...f, [k]: e.target.value }));

  const saveService = async () => {
    setSaving(true);
    try {
      await api.updateService(service.id, { ...editForm, display_order: service.display_order });
      setEditingService(false);
      onRefresh();
    } finally {
      setSaving(false);
    }
  };

  const deleteService = async () => {
    if (!window.confirm(`Delete "${service.name}"? This will also delete all its plans.`)) return;
    setDeleting(true);
    try {
      await api.deleteService(service.id);
      onRefresh();
    } finally {
      setDeleting(false);
    }
  };

  const savePlan = async (data, planId) => {
    if (planId) {
      await api.updatePlan(planId, data);
    } else {
      await api.createPlan({ ...data, service_id: service.id });
    }
    setAddingPlan(false);
    setEditingPlan(null);
    onRefresh();
  };

  const deletePlan = async (planId) => {
    if (!window.confirm('Delete this plan?')) return;
    await api.deletePlan(planId);
    onRefresh();
  };

  const inp = {
    width: '100%', padding: '10px 14px',
    background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', color: 'var(--text-heading)',
    fontSize: '0.88rem', fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div className="card" style={{ padding: 24, marginBottom: 12 }}>
      {editingService ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-2)', marginBottom: 6 }}>Service Name</label>
              <input style={inp} value={editForm.name} onChange={setE('name')} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-2)', marginBottom: 6 }}>Icon</label>
              <select style={{ ...inp, cursor: 'pointer' }} value={editForm.icon} onChange={setE('icon')}>
                {ICON_OPTIONS.map(i => <option key={i} value={i} style={{ background: '#0f0c1a' }}>{i}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-2)', marginBottom: 6 }}>Status</label>
              <select style={{ ...inp, cursor: 'pointer' }} value={editForm.is_active} onChange={e => setEditForm(f => ({ ...f, is_active: Number(e.target.value) }))}>
                <option value={1} style={{ background: '#0f0c1a' }}>Active</option>
                <option value={0} style={{ background: '#0f0c1a' }}>Hidden</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-2)', marginBottom: 6 }}>Description</label>
            <textarea style={{ ...inp, resize: 'vertical', minHeight: 80 }} value={editForm.description} onChange={setE('description')} />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => setEditingService(false)} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              <X size={14} /> Cancel
            </button>
            <button onClick={saveService} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} disabled={saving}>
              {saving ? <Loader size={14} /> : <Check size={14} />}
              Save Service
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'var(--accent-bg)', border: '1px solid var(--border-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Package size={18} color="var(--accent)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h3 style={{ fontSize: '1rem', margin: 0 }}>{service.name}</h3>
                <span style={{
                  fontSize: '0.68rem', padding: '2px 8px', borderRadius: 50,
                  background: service.is_active ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.05)',
                  color: service.is_active ? 'var(--success)' : 'var(--text-2)',
                  border: `1px solid ${service.is_active ? 'rgba(52,211,153,0.3)' : 'var(--border)'}`,
                  fontWeight: 600,
                }}>
                  {service.is_active ? 'Active' : 'Hidden'}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', marginTop: 4 }}>{service.description}</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setEditingService(true)} className="btn btn-ghost" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
                <Edit2 size={14} /> Edit
              </button>
              <button onClick={() => setExpanded(o => !o)} className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
                {service.plans?.length || 0} plans {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              <button onClick={deleteService} disabled={deleting}
                style={{ padding: '8px 12px', background: 'none', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--error)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                {deleting ? <Loader size={14} /> : <Trash2 size={14} />}
              </button>
            </div>
          </div>

          {/* Plans section */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden', marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)' }}
              >
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-2)', margin: 0 }}>Pricing Plans</h4>
                  <button onClick={() => setAddingPlan(true)} className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.78rem', marginLeft: 'auto' }}>
                    <Plus size={13} /> Add Plan
                  </button>
                </div>

                {addingPlan && (
                  <div style={{ marginBottom: 16, padding: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                    <PlanForm onSave={(d) => savePlan(d, null)} onCancel={() => setAddingPlan(false)} />
                  </div>
                )}

                {(service.plans || []).map(plan => (
                  <div key={plan.id} style={{ marginBottom: 10, padding: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                    {editingPlan === plan.id ? (
                      <PlanForm
                        plan={plan}
                        onSave={(d) => savePlan(d, plan.id)}
                        onCancel={() => setEditingPlan(null)}
                      />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-heading)' }}>{plan.name}</span>
                            {plan.highlighted ? <Star size={12} color="var(--accent)" fill="var(--accent)" /> : null}
                          </div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>
                            {plan.billing_type === 'quote' ? 'Contact for quote' : `${plan.currency === 'INR' ? '₹' : '$'}${plan.price} (${plan.billing_type})`}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => setEditingPlan(plan.id)} className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                            <Edit2 size={12} /> Edit
                          </button>
                          <button onClick={() => deletePlan(plan.id)}
                            style={{ padding: '6px 10px', background: 'none', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--error)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {(!service.plans || service.plans.length === 0) && !addingPlan && (
                  <div style={{ textAlign: 'center', color: 'var(--text-2)', fontSize: '0.85rem', padding: '20px 0' }}>
                    No plans yet. Add one above.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newService, setNewService] = useState({ name: '', description: '', icon: 'globe' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await api.getAdminServices();
      setServices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const createService = async () => {
    if (!newService.name || !newService.description) return;
    setSaving(true);
    try {
      await api.createService({ ...newService, display_order: services.length + 1, is_active: 1 });
      setAdding(false);
      setNewService({ name: '', description: '', icon: 'globe' });
      load();
    } finally {
      setSaving(false);
    }
  };

  const inp = {
    width: '100%', padding: '10px 14px',
    background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', color: 'var(--text-heading)',
    fontSize: '0.88rem', fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: 4 }}>Services</h2>
          <p style={{ color: 'var(--text-2)', fontSize: '0.85rem' }}>Manage your service offerings and pricing plans.</p>
        </div>
        <button onClick={() => setAdding(o => !o)} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.88rem' }}>
          <Plus size={16} /> Add Service
        </button>
      </div>

      {/* Add service form */}
      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', marginBottom: 16 }}
          >
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: '0.95rem', marginBottom: 16 }}>New Service</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-2)', marginBottom: 6 }}>Name *</label>
                  <input style={inp} value={newService.name} onChange={e => setNewService(s => ({ ...s, name: e.target.value }))} placeholder="e.g. Web Development" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-2)', marginBottom: 6 }}>Icon</label>
                  <select style={{ ...inp, cursor: 'pointer' }} value={newService.icon} onChange={e => setNewService(s => ({ ...s, icon: e.target.value }))}>
                    {ICON_OPTIONS.map(i => <option key={i} value={i} style={{ background: '#0f0c1a' }}>{i}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-2)', marginBottom: 6 }}>Description *</label>
                <textarea style={{ ...inp, resize: 'vertical', minHeight: 80 }}
                  value={newService.description}
                  onChange={e => setNewService(s => ({ ...s, description: e.target.value }))}
                  placeholder="Brief description of this service..."
                />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button onClick={() => setAdding(false)} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Cancel</button>
                <button onClick={createService} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} disabled={saving || !newService.name}>
                  {saving ? <Loader size={14} /> : <Plus size={14} />}
                  Create Service
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-2)' }}>Loading...</div>
      ) : services.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-2)' }}>
          No services yet. Create your first one!
        </div>
      ) : (
        services.map(svc => <ServiceCard key={svc.id} service={svc} onRefresh={load} />)
      )}
    </div>
  );
}
