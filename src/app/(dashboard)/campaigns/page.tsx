"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCampaignStore, useAuthStore } from "@/lib/store";
import { apiClient } from "@/lib/api";
import {
  Plus,
  Trash2,
  Play,
  Pause,
  Calendar,
  DollarSign,
  Target,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

export default function CampaignsPage() {
  const { campaigns, setCampaigns, removeCampaign } = useCampaignStore();
  const { token } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      apiClient.setToken(token);
      loadCampaigns();
    }
  }, [token]);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getCampaigns();
      setCampaigns(response.campaigns);
    } catch (error) {
      console.error("Failed to load campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (campaignId: string) => {
    try {
      await apiClient.deleteCampaign(campaignId);
      removeCampaign(campaignId);
    } catch (error) {
      console.error("Failed to delete campaign:", error);
    }
  };

  const activeCampaigns = campaigns.filter((c) => c.status === "active").length;
  const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
  const newThisMonth = campaigns.filter((c) => {
    const created = new Date(c.created_at * 1000);
    const now = new Date();
    return (
      created.getMonth() === now.getMonth() &&
      created.getFullYear() === now.getFullYear()
    );
  }).length;
  const uniqueProducts = new Set(campaigns.map((c) => c.product_id)).size;

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">My Campaigns</h1>
          <p className="text-muted-foreground">
            Manage your active affiliate campaigns
          </p>
        </div>
        <Button onClick={() => router.push("/campaigns/new")}>
          <Plus className="w-5 h-5 mr-2" />
          New Campaign
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Active Campaigns"
          value={activeCampaigns}
          icon={<Play />}
        />
        <StatCard
          label="Total Budget"
          value={`$${totalBudget.toLocaleString()}`}
          icon={<DollarSign />}
        />
        <StatCard
          label="New This Month"
          value={newThisMonth}
          icon={<Calendar />}
        />
        <StatCard
          label="Unique Products"
          value={uniqueProducts}
          icon={<Target />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-muted-foreground">Loading campaigns...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead className="text-right">Budget</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">
                      {campaign.name}
                    </TableCell>
                    <TableCell>{campaign.product_name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          campaign.status === "active" ? "default" : "outline"
                        }
                      >
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(
                        new Date(campaign.created_at * 1000),
                        "MMM d, yyyy",
                      )}
                    </TableCell>
                    <TableCell className="text-right">{`$${(campaign.budget || 0).toLocaleString()}`}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/campaigns/${campaign.id}`)
                            }
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/campaigns/${campaign.id}/edit`)
                            }
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(campaign.id)}
                            className="text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
