import React, { useState, useEffect } from 'react';
import { Phone, Mail, Eye, LogOut, Filter } from 'lucide-react';

interface ReservationForm {
  clientName: string;
  clientEmail?: string;
  clientPhone: string;
  bookingDate?: string;
  bookingTime?: string;
  bookingType?: string;
  description?: string;
  licensePlate?: string;
  requestType?: string;
  issueDescription?: string;
  hasPhotos?: boolean;
  isStudent?: boolean;
}

interface Request {
  id: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  confirmedAt?: string;
  form: ReservationForm;
  amount_cents?: number;
  type: 'reservation' | 'devis';
  price_total_cents?: number;
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'LesMakhloufs';

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [requests, setRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const stored = localStorage.getItem('adminAuth');
    if (stored) setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchAllRequests();
  }, [isAuthenticated, statusFilter, typeFilter, dateFilter, dateFrom, dateTo, sortOrder]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('adminAuth', 'true');
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('Mot de passe incorrect');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    setRequests([]);
    setFilteredRequests([]);
  };

  const fetchAllRequests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);

      const today = new Date();
      let fromDate = '';
      let toDate = '';

      if (dateFilter === 'today') {
        fromDate = toDate = today.toISOString().split('T')[0];
      } else if (dateFilter === 'week') {
        const start = new Date(today);
        start.setDate(today.getDate() - today.getDay());
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        fromDate = start.toISOString().split('T')[0];
        toDate = end.toISOString().split('T')[0];
      } else if (dateFilter === 'month') {
        fromDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        toDate = nextMonth.toISOString().split('T')[0];
      } else if (dateFilter === 'custom' && dateFrom && dateTo) {
        fromDate = dateFrom;
        toDate = dateTo;
      }

      if (fromDate) params.append('dateFrom', fromDate);
      if (toDate) params.append('dateTo', toDate);
      params.append('sortOrder', sortOrder);

      const [resRes, devisRes] = await Promise.all([
        fetch(`http://localhost:4000/api/reservations?${params.toString()}`),
        fetch(`http://localhost:4000/api/devis?${params.toString()}`)
      ]);

      let allRequests: Request[] = [];

      if (resRes.ok) {
        const resData = await resRes.json();
        allRequests.push(...resData.map((r: any) => ({ ...r, type: 'reservation' as const })));
      }

      if (devisRes.ok) {
        const devisData = await devisRes.json();
        allRequests.push(...devisData.map((d: any) => ({ ...d, type: 'devis' as const })));
      }

      if (typeFilter === 'reservation') {
        allRequests = allRequests.filter(r => r.type === 'reservation');
      } else if (typeFilter === 'devis') {
        allRequests = allRequests.filter(r => r.type === 'devis');
      }

      allRequests.sort((a, b) => {
        const aDate = new Date(a.createdAt).getTime();
        const bDate = new Date(b.createdAt).getTime();
        return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
      });

      setRequests(allRequests);
      setFilteredRequests(allRequests);
    } catch (err) {
      console.error('Error fetching requests', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (requestId: string, newStatus: string, type: 'reservation' | 'devis') => {
    try {
      const endpoint = type === 'reservation' ? 'reservations' : 'devis';
      const response = await fetch(`http://localhost:4000/api/${endpoint}/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        const updated = await response.json();
        const updatedRequest = { ...updated, type };
        setRequests(prev => prev.map(r => r.id === requestId ? updatedRequest : r));
        if (selectedRequest?.id === requestId) {
          setSelectedRequest(updatedRequest);
        }
      }
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    const labels = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      cancelled: 'Annulée'
    };
    return (
      <span className={`px-2 py-1 rounded text-sm font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  const getTypeLabel = (req: Request) => {
    return req.type === 'devis' ? 'Devis Mécanique' : 'Accompagnement Achat';
  };

  const getDateDisplay = (req: Request) => req.form.bookingDate || new Date(req.createdAt).toISOString().split('T')[0];
  const getTimeDisplay = (req: Request) => req.form.bookingTime || new Date(req.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const formatDateTime = (dateStr: string) => new Date(dateStr).toLocaleString('fr-FR');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-2">YassAuto</h1>
          <p className="text-center text-gray-600 mb-8">Tableau de bord admin</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe admin</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez le mot de passe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
              style={{ backgroundColor: '#e30613' }}
            >
              Connexion
            </button>
          </form>
        </div>
      </div>
    );
  }

  const resCount = requests.filter(r => r.type === 'reservation').length;
  const devisCount = requests.filter(r => r.type === 'devis').length;
  const confirmedCount = requests.filter(r => r.status === 'confirmed').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">YassAuto Dashboard</h1>
            <p className="text-gray-400 text-sm">Réservations et devis</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
            style={{ backgroundColor: '#e30613' }}
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Total</p>
            <p className="text-3xl font-bold">{requests.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Accompagnements</p>
            <p className="text-3xl font-bold text-blue-600">{resCount}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Devis mécanique</p>
            <p className="text-3xl font-bold text-purple-600">{devisCount}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Confirmées</p>
            <p className="text-3xl font-bold text-green-600">{confirmedCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} />
            <h2 className="text-lg font-semibold">Filtres</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Tous</option>
                <option value="reservation">Accompagnement</option>
                <option value="devis">Devis</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Tous</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmées</option>
                <option value="cancelled">Annulées</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">Toutes les dates</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="custom">Personnalisé</option>
              </select>
            </div>
            {dateFilter === 'custom' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Du</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Au</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tri</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="asc">Plus récent d'abord</option>
                <option value="desc">Plus ancien d'abord</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Heure</th>
                  <th className="px-4 py-3 text-left">Client</th>
                  <th className="px-4 py-3 text-left">Contact</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Statut</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={7} className="px-4 py-4 text-center text-gray-500">Chargement...</td></tr>
                ) : filteredRequests.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-4 text-center text-gray-500">Aucune demande</td></tr>
                ) : (
                  filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{getDateDisplay(req)}</td>
                      <td className="px-4 py-3">{getTimeDisplay(req)}</td>
                      <td className="px-4 py-3 font-medium">
                        <div className="flex items-center gap-2">
                          <span>{req.form.clientName}</span>
                          {req.type === 'reservation' && req.form.isStudent && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">Étudiant</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 space-y-1 text-xs">
                        <a href={`tel:${req.form.clientPhone}`} className="flex items-center gap-1 text-blue-600">
                          <Phone size={12} /> {req.form.clientPhone}
                        </a>
                        {req.form.clientEmail && (
                          <a href={`mailto:${req.form.clientEmail}`} className="flex items-center gap-1 text-blue-600">
                            <Mail size={12} /> {req.form.clientEmail.split('@')[0]}...
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs font-medium" style={{ color: req.type === 'devis' ? '#9333ea' : '#2563eb' }}>
                        {getTypeLabel(req)}
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(req.status)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => { setSelectedRequest(req); setShowModal(true); }}
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs flex items-center gap-1"
                        >
                          <Eye size={12} /> Détails
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-black text-white p-6 flex justify-between items-center sticky top-0">
              <h2 className="text-xl font-bold">{selectedRequest.type === 'devis' ? 'Demande de devis' : 'Réservation'}</h2>
              <button onClick={() => setShowModal(false)} className="text-2xl">×</button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">ID</p>
                  <p className="text-lg font-mono">{selectedRequest.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">Statut</p>
                  {getStatusBadge(selectedRequest.status)}
                </div>
              </div>

              <hr />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">Créée</p>
                  <p className="text-sm">{formatDateTime(selectedRequest.createdAt)}</p>
                </div>
                {selectedRequest.confirmedAt && (
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold">Confirmée</p>
                    <p className="text-sm">{formatDateTime(selectedRequest.confirmedAt)}</p>
                  </div>
                )}
              </div>

              <hr />

              <div>
                <h3 className="text-sm font-semibold mb-3 uppercase">Client</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-600">Nom:</span> <span className="font-medium">{selectedRequest.form.clientName}</span></p>
                  {selectedRequest.form.clientEmail && (
                    <p><span className="text-gray-600">Email:</span> <a href={`mailto:${selectedRequest.form.clientEmail}`} className="text-blue-600">{selectedRequest.form.clientEmail}</a></p>
                  )}
                  <p><span className="text-gray-600">Tél:</span> <a href={`tel:${selectedRequest.form.clientPhone}`} className="text-blue-600">{selectedRequest.form.clientPhone}</a></p>
                </div>
              </div>

              <hr />

              {selectedRequest.type === 'reservation' ? (
                <>
                  <div>
                    <h3 className="text-sm font-semibold mb-3 uppercase">Rendez-vous</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-600">Date:</span> <span className="font-medium">{selectedRequest.form.bookingDate}</span></p>
                      <p><span className="text-gray-600">Heure:</span> <span className="font-medium">{selectedRequest.form.bookingTime}</span></p>
                    </div>
                  </div>
                  <hr />
                  <div>
                    <h3 className="text-sm font-semibold mb-3 uppercase">Détails</h3>
                    <div className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap">{selectedRequest.form.description}</div>
                  </div>
                  <hr />
                  <div>
                    <h3 className="text-sm font-semibold mb-3 uppercase">Tarifs</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-600">Statut étudiant:</span> <span className="font-medium">{selectedRequest.form.isStudent ? 'Oui' : 'Non'}</span></p>
                      <p><span className="text-gray-600">Prix appliqué:</span> <span className="font-medium">{((selectedRequest.price_total_cents || (selectedRequest.form.isStudent ? 10000 : 15000)) / 100).toFixed(2)} € TTC{selectedRequest.form.isStudent ? ' (tarif étudiant)' : ''}</span></p>
                      <p><span className="text-gray-600">Acompte payé en ligne:</span> <span className="font-medium text-green-600">{((selectedRequest.amount_cents || 0) / 100).toFixed(2)} €</span></p>
                      <p><span className="text-gray-600">Solde à régler sur place:</span> <span className="font-medium">{(((selectedRequest.price_total_cents || (selectedRequest.form.isStudent ? 10000 : 15000)) - (selectedRequest.amount_cents || 0)) / 100).toFixed(2)} €</span></p>
                      {selectedRequest.form.isStudent && (
                        <p className="text-sm text-yellow-800">⚠️ Vérifier la carte d'étudiant lors du RDV</p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="text-sm font-semibold mb-3 uppercase">Demande de devis</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-600">Immat:</span> <span className="font-medium">{selectedRequest.form.licensePlate || 'N/A'}</span></p>
                      <p><span className="text-gray-600">Type:</span> <span className="font-medium">{selectedRequest.form.requestType === 'repair' ? 'Réparation' : 'Diagnostic'}</span></p>
                      <p><span className="text-gray-600">Photos:</span> <span className="font-medium">{selectedRequest.form.hasPhotos ? 'Oui' : 'Non'}</span></p>
                    </div>
                  </div>
                  <hr />
                  <div>
                    <h3 className="text-sm font-semibold mb-3 uppercase">Problème décrit</h3>
                    <div className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap">{selectedRequest.form.issueDescription}</div>
                  </div>
                </>
              )}

              <hr />

              <div className="space-y-3">
                <p className="text-xs text-gray-600 uppercase font-semibold">Actions</p>
                <div className="flex flex-wrap gap-2">
                  <a href={`tel:${selectedRequest.form.clientPhone}`} className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2">
                    <Phone size={16} /> Appeler
                  </a>
                  {selectedRequest.form.clientEmail && (
                    <a href={`mailto:${selectedRequest.form.clientEmail}`} className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2">
                      <Mail size={16} /> Email
                    </a>
                  )}
                </div>
              </div>

              {selectedRequest.status !== 'cancelled' && (
                <div className="space-y-3 bg-yellow-50 p-3 rounded">
                  <p className="text-xs text-gray-600 uppercase font-semibold">Changer statut</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRequest.status !== 'confirmed' && (
                      <button
                        onClick={() => {
                          handleStatusChange(selectedRequest.id, 'confirmed', selectedRequest.type);
                          setShowModal(false);
                        }}
                        className="px-4 py-2 bg-green-500 text-white rounded"
                      >
                        Marquer confirmée
                      </button>
                    )}
                    {selectedRequest.status !== 'cancelled' && (
                      <button
                        onClick={() => {
                          handleStatusChange(selectedRequest.id, 'cancelled', selectedRequest.type);
                          setShowModal(false);
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded"
                      >
                        Annuler
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
