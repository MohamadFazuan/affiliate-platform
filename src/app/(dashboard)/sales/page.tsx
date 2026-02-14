"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { apiClient } from "@/lib/api";
import {
  Plus,
  TrendingUp,
  DollarSign,
  MousePointer,
  Target,
  Calendar,
  Download,
  Edit,
  Trash2,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

interface Campaign {
  id: string;
  name: string;
}

interface Sale {
  id: string;
  campaign_id: string;
  campaign_name: string;
  product_name: string;
  date: number;
  clicks: number;
  conversions: number;
  revenue: number;
  commission_earned: number;
  cost: number;
}

export default function SalesPage() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [sales, setSales] = useState<Sale[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState({
    campaignId: "all",
    dateFrom: "",
    dateTo: "",
  });
  const [formData, setFormData] = useState({
    campaign_id: "",
    clicks: "",
    conversions: "",
    revenue: "",
    cost: "",
  });

  useEffect(() => {
    if (token) {
      apiClient.setToken(token);
      loadData();
    }
  }, [token]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load campaigns for dropdown
      const campaignsResponse = await apiClient.getCampaigns();
      setCampaigns(campaignsResponse.campaigns);

      // Load sales with filters
      const filterParams: any = {};
      if (filter.campaignId && filter.campaignId !== "all")
        filterParams.campaignId = filter.campaignId;
      if (filter.dateFrom)
        filterParams.dateFrom = Math.floor(
          new Date(filter.dateFrom).getTime() / 1000,
        );
      if (filter.dateTo)
        filterParams.dateTo = Math.floor(
          new Date(filter.dateTo).getTime() / 1000,
        );

      const [salesResponse, statsResponse] = await Promise.all([
        apiClient.getSales(filterParams),
        apiClient.getSalesStats(filterParams),
      ]);

      setSales(salesResponse.sales);
      setStats(statsResponse);
    } catch (error) {
      console.error("Failed to load sales data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSale = async () => {
    if (!formData.campaign_id || !formData.revenue) {
      alert("Please select a campaign and enter revenue");
      return;
    }

    try {
      await apiClient.recordSale({
        campaign_id: formData.campaign_id,
        clicks: parseInt(formData.clicks) || 0,
        conversions: parseInt(formData.conversions) || 0,
        revenue: parseFloat(formData.revenue),
        cost: parseFloat(formData.cost) || 0,
      });

      setShowAddModal(false);
      setFormData({
        campaign_id: "",
        clicks: "",
        conversions: "",
        revenue: "",
        cost: "",
      });
      loadData();
    } catch (error: any) {
      alert("Failed to add sale: " + error.message);
    }
  };

  const handleDeleteSale = async (saleId: string) => {
    if (!confirm("Are you sure you want to delete this sale record?")) return;

    try {
      await apiClient.deleteSale(saleId);
      loadData();
    } catch (error) {
      alert("Failed to delete sale");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2">
              Sales Tracking
            </h1>
            <p className="text-muted-foreground">
              Monitor your affiliate sales and commissions
            </p>
          </div>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Record Sale
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record New Sale</DialogTitle>
                <DialogDescription>
                  Add a new sale entry for tracking
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="campaign">Campaign *</Label>
                  <Select
                    value={formData.campaign_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, campaign_id: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      {campaigns.map((campaign) => (
                        <SelectItem key={campaign.id} value={campaign.id}>
                          {campaign.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clicks">Clicks</Label>
                    <Input
                      id="clicks"
                      type="number"
                      value={formData.clicks}
                      onChange={(e) =>
                        setFormData({ ...formData, clicks: e.target.value })
                      }
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="conversions">Conversions</Label>
                    <Input
                      id="conversions"
                      type="number"
                      value={formData.conversions}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          conversions: e.target.value,
                        })
                      }
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="revenue">Revenue (USD) *</Label>
                    <Input
                      id="revenue"
                      type="number"
                      step="0.01"
                      value={formData.revenue}
                      onChange={(e) =>
                        setFormData({ ...formData, revenue: e.target.value })
                      }
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cost">Cost (USD)</Label>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      value={formData.cost}
                      onChange={(e) =>
                        setFormData({ ...formData, cost: e.target.value })
                      }
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddSale}>Add Sale</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.total_revenue)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Commission
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.total_commission)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ROI: {stats.roi.toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Clicks
              </CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.total_clicks.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversions</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.total_conversions}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.conversion_rate.toFixed(2)}% rate
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="filter-campaign">Campaign</Label>
              <Select
                value={filter.campaignId}
                onValueChange={(value) =>
                  setFilter({ ...filter, campaignId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All campaigns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All campaigns</SelectItem>
                  {campaigns.map((campaign) => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date-from">From Date</Label>
              <Input
                id="date-from"
                type="date"
                value={filter.dateFrom}
                onChange={(e) =>
                  setFilter({ ...filter, dateFrom: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="date-to">To Date</Label>
              <Input
                id="date-to"
                type="date"
                value={filter.dateTo}
                onChange={(e) =>
                  setFilter({ ...filter, dateTo: e.target.value })
                }
              />
            </div>
            <div className="flex items-end">
              <Button onClick={loadData} className="w-full">
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Sales Records</CardTitle>
              <CardDescription>
                {sales.length} sale{sales.length !== 1 ? "s" : ""} recorded
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-muted-foreground">Loading sales...</p>
            </div>
          ) : sales.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                No sales recorded yet
              </p>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Sale
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                    <TableHead className="text-right">Conversions</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Commission</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>
                        {format(new Date(sale.date * 1000), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="font-medium">
                        {sale.campaign_name}
                      </TableCell>
                      <TableCell>{sale.product_name}</TableCell>
                      <TableCell className="text-right">
                        {sale.clicks.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {sale.conversions}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(sale.revenue)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-green-600">
                        {formatCurrency(sale.commission_earned)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSale(sale.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
