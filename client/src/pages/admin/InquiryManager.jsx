import { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { fetchInquiries, updateInquiry, deleteInquiry } from '../../utils/api';
import AdminSidebar from '../../components/AdminSidebar';

export default function InquiryManager() {
  const [inquiries, setInquiries] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    fetchInquiries({ page, limit: 15, status })
      .then((r) => { setInquiries(r.data.inquiries); setTotal(r.data.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, status]);

  useEffect(() => { load(); }, [load]);

  const toggle = async (id, field) => {
    const inq = inquiries.find((i) => i._id === id);
    try {
      await updateInquiry(id, { [field]: !inq[field] });
      load();
    } catch { toast.error('Update failed'); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteInquiry(id);
      toast.success('Deleted');
      setDeleteConfirm(null);
      load();
    } catch { toast.error('Delete failed'); }
  };

  const pages = Math.ceil(total / 15);

  return (
    <>
      <Helmet><title>Inquiries — Amoda Admin</title></Helmet>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-8 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-serif text-2xl text-text-dark">Inquiries</h1>
              <p className="font-sans text-sm text-secondary">{total} messages</p>
            </div>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="border border-accent rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary"
            >
              <option value="">All</option>
              <option value="unread">Unread</option>
              <option value="pending">Pending Reply</option>
            </select>
          </div>

          {deleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-dark/50">
              <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl">
                <p className="font-sans text-sm text-text-dark mb-4">Delete this inquiry from <strong>{deleteConfirm.name}</strong>?</p>
                <div className="flex gap-3">
                  <button onClick={() => handleDelete(deleteConfirm._id)} className="btn-primary bg-red-500 hover:bg-red-600 text-sm">Delete</button>
                  <button onClick={() => setDeleteConfirm(null)} className="btn-outline text-sm">Cancel</button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton h-20 rounded-candle" />
              ))
            ) : inquiries.length === 0 ? (
              <div className="text-center py-16 text-secondary font-sans">No inquiries found</div>
            ) : (
              inquiries.map((inq) => (
                <div
                  key={inq._id}
                  className={`bg-white rounded-candle shadow-card overflow-hidden border-l-4 transition-all ${
                    !inq.isRead ? 'border-primary' : 'border-accent'
                  }`}
                >
                  <div
                    className="p-4 cursor-pointer flex items-start gap-3"
                    onClick={() => {
                      setExpanded(expanded === inq._id ? null : inq._id);
                      if (!inq.isRead) toggle(inq._id, 'isRead');
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-sans font-medium text-text-dark text-sm">{inq.name}</p>
                        {!inq.isRead && <span className="w-2 h-2 bg-primary rounded-full" />}
                        {inq.isReplied && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Replied</span>}
                      </div>
                      <p className="font-sans text-xs text-secondary">{inq.email}</p>
                      <p className="font-sans text-xs text-secondary/60 truncate mt-1">{inq.message}</p>
                    </div>
                    <span className="font-sans text-xs text-secondary/40 whitespace-nowrap flex-shrink-0">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {expanded === inq._id && (
                    <div className="border-t border-accent px-4 py-3 bg-background/50">
                      <p className="font-sans text-sm text-secondary leading-relaxed mb-3">{inq.message}</p>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => toggle(inq._id, 'isRead')}
                          className="text-xs border border-accent rounded-lg px-3 py-1.5 hover:border-primary hover:text-primary transition-colors font-sans"
                        >
                          {inq.isRead ? 'Mark Unread' : 'Mark Read'}
                        </button>
                        <button
                          onClick={() => toggle(inq._id, 'isReplied')}
                          className="text-xs border border-accent rounded-lg px-3 py-1.5 hover:border-green-500 hover:text-green-600 transition-colors font-sans"
                        >
                          {inq.isReplied ? 'Mark Pending' : 'Mark Replied'}
                        </button>
                        <a
                          href={`mailto:${inq.email}`}
                          className="text-xs bg-primary text-white rounded-lg px-3 py-1.5 font-sans"
                        >
                          Reply via Email
                        </a>
                        <button
                          onClick={() => setDeleteConfirm(inq)}
                          className="text-xs text-red-500 hover:underline font-sans"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {pages > 1 && (
            <div className="flex gap-2 mt-6">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-full text-xs font-sans transition-all ${
                    page === p ? 'bg-primary text-white' : 'border border-accent text-secondary hover:border-primary'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
