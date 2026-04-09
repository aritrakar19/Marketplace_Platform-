import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { Check, X, MessageSquare } from 'lucide-react';
import { Link } from 'react-router';

export default function InvitesList() {
  const { currentUser, userData } = useAuth();
  const [invites, setInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvites = async () => {
    if (!currentUser) return;
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('http://localhost:5000/api/invites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setInvites(data.data);
      }
    } catch (error) {
      console.error('Error fetching invites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, [currentUser]);

  const handleUpdateStatus = async (inviteId: string, status: 'accepted' | 'rejected') => {
    if (!currentUser) return;
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`http://localhost:5000/api/invites/${inviteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`Invite ${status}`);
        fetchInvites(); // Refresh list
      } else {
        toast.error(data.message || 'Failed to update invite');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  if (loading) return <p className="text-gray-500">Loading invites...</p>;

  const incomingInvites = invites.filter(inv => inv.receiverId === currentUser?.uid && inv.status === 'pending');

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg mb-4">
        {userData?.role === 'talent' ? 'Incoming Invites' : 'Sent Invites'}
      </h3>
      
      {userData?.role === 'talent' ? (
        incomingInvites.length > 0 ? (
          <div className="grid gap-4">
            {incomingInvites.map((invite) => (
              <Card key={invite._id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">New Invite from Brand</p>
                  <p className="text-sm text-gray-500">{new Date(invite.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleUpdateStatus(invite._id, 'rejected')}
                  >
                    <X className="w-4 h-4 mr-1" /> Reject
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleUpdateStatus(invite._id, 'accepted')}
                  >
                    <Check className="w-4 h-4 mr-1" /> Accept
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm italic">No pending invites.</p>
        )
      ) : (
        <div className="grid gap-4">
          {invites.filter(inv => inv.senderId === currentUser?.uid).map((invite) => (
            <Card key={invite._id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Invite to Talent</p>
                <p className="text-sm text-gray-500">{new Date(invite.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={invite.status === 'accepted' ? 'success' : invite.status === 'pending' ? 'secondary' : 'destructive'}>
                  {invite.status}
                </Badge>
                {invite.status === 'accepted' && (
                  <Link to="/chat">
                    <Button size="sm" variant="ghost">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          ))}
          {invites.filter(inv => inv.senderId === currentUser?.uid).length === 0 && (
             <p className="text-gray-500 text-sm italic">You haven't sent any invites yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
