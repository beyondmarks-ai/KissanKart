import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { toast } from 'sonner';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ProductsTable } from '@/components/dashboard/ProductsTable';
import { AddProductDialog } from '@/components/dashboard/AddProductDialog';
import { OverviewContent } from '@/components/dashboard/OverviewContent';
import { AnalyticsContent } from '@/components/dashboard/AnalyticsContent';
import { SettingsContent } from '@/components/dashboard/SettingsContent';
import { KYCContent } from '@/components/dashboard/KYCContent';
import { ProfileContent } from '@/components/dashboard/ProfileContent';
import { SupportContent } from '@/components/dashboard/SupportContent';

export default function FarmerDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const farmerShopName =
    profile?.shop_name ||
    profile?.farm_name ||
    (user?.user_metadata?.shopName as string | undefined) ||
    '';

  const [formData, setFormData] = useState({
    farm_name: '',
    name: '',
    description: '',
    category: 'vegetable' as 'vegetable' | 'fruit',
    price: '',
    unit: 'kg',
    image_url: '',
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/auth?role=farmer');
      } else if (profile && profile.role !== 'farmer') {
        toast.error('Access denied. Farmer account required.');
        navigate('/');
      }
    }
  }, [user, profile, authLoading, navigate]);

  useEffect(() => {
    if (user && profile?.role === 'farmer') {
      fetchProducts();
    }
  }, [user, profile]);

  useEffect(() => {
    if (!farmerShopName) return;

    setFormData((current) =>
      current.farm_name ? current : { ...current, farm_name: farmerShopName }
    );
  }, [farmerShopName]);

  const fetchProducts = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('farmer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } else {
      setProducts(data as Product[]);
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.farm_name.trim() || !formData.name || !formData.price) {
      toast.error('Please fill in required fields');
      return;
    }

    setSubmitting(true);

    const productPayload = {
      name: formData.name,
      description: formData.description || null,
      category: formData.category,
      price: parseFloat(formData.price),
      unit: formData.unit,
      image_url: formData.image_url || null,
      farm_name: formData.farm_name.trim(),
      farm_location:
        profile?.address ||
        (user.user_metadata?.address as string | undefined) ||
        null,
      farmer_id: user.id,
      is_available: true,
    };

    const { error } = await supabase.from('products').insert(productPayload);

    if (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    } else {
      toast.success('Product added successfully!');
      setFormData({
        farm_name: formData.farm_name,
        name: '',
        description: '',
        category: 'vegetable',
        price: '',
        unit: 'kg',
        image_url: '',
      });
      setIsAddDialogOpen(false);
      fetchProducts();
    }

    setSubmitting(false);
  };

  const handleDelete = async (productId: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      toast.error('Failed to delete product');
    } else {
      toast.success('Product deleted');
      fetchProducts();
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const getTabTitle = () => {
    switch (currentTab) {
      case 'products': return 'Products';
      case 'analytics': return 'Analytics';
      case 'settings': return 'Settings';
      case 'kyc': return 'KYC Verification';
      case 'profile': return 'My Profile';
      case 'support': return 'Support & Help';
      default: return 'Overview';
    }
  };

  const getTabSubtitle = () => {
    switch (currentTab) {
      case 'products': return 'Manage your product listings';
      case 'analytics': return 'Track your performance metrics';
      case 'settings': return 'Configure your account preferences';
      case 'kyc': return 'Verify your identity to start selling';
      case 'profile': return 'Manage your personal details';
      case 'support': return 'Get help with your issues';
      default: return `Welcome back, ${profile?.full_name || 'Farmer'}!`;
    }
  };

  const handleNavigate = (tab: string) => {
    navigate(tab ? `/dashboard?tab=${tab}` : '/dashboard');
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex min-h-[320px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading products...</p>
          </div>
        </div>
      );
    }

    switch (currentTab) {
      case 'products':
        return (
          <ProductsTable
            products={products}
            onDelete={handleDelete}
            onAddProduct={() => setIsAddDialogOpen(true)}
          />
        );
      case 'analytics':
        return <AnalyticsContent products={products} />;
      case 'settings':
        return <SettingsContent />;
      case 'kyc':
        return <KYCContent />;
      case 'profile':
        return <ProfileContent />;
      case 'support':
        return <SupportContent />;
      default:
        return (
          <OverviewContent
            products={products}
            onAddProduct={() => setIsAddDialogOpen(true)}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-muted/20 to-background">
        <DashboardSidebar />

        <div className="flex-1 flex flex-col">
          <DashboardHeader
            title={getTabTitle()}
            subtitle={getTabSubtitle()}
            onAddProduct={() => setIsAddDialogOpen(true)}
            showAddButton={currentTab === '' || currentTab === 'products'}
          />

          <main className="flex-1 p-6 overflow-auto">
            <div className="mx-auto max-w-7xl animate-fade-in">
              {renderContent()}
            </div>
          </main>
        </div>

        {/* Add Product Dialog */}
        <AddProductDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </div>
    </SidebarProvider>
  );
}
