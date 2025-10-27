import { requireAuth } from '@/lib/auth/session';
import { MetricCard } from '@/components/ui/metric-card';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Heart, Zap, TrendingUp } from 'lucide-react';

export default async function DashboardPage() {
  const user = await requireAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Welcome back, {user.full_name || user.email.split('@')[0]}
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's your health overview for today
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Recovery Score"
          value="--"
          unit="%"
          description="Connect WHOOP to see your recovery"
          icon={Heart}
          trend={{
            value: 0,
            label: 'vs. yesterday',
            direction: 'neutral',
          }}
        />
        
        <MetricCard
          title="Strain"
          value="--"
          description="Connect WHOOP to track your strain"
          icon={Zap}
        />
        
        <MetricCard
          title="Sleep Score"
          value="--"
          unit="hrs"
          description="Connect Oura to monitor your sleep"
          icon={Activity}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Heart Rate"
          value="--"
          icon={Heart}
          variant="default"
        />
        <StatCard
          label="HRV"
          value="--"
          icon={TrendingUp}
          variant="default"
        />
        <StatCard
          label="Steps"
          value="--"
          icon={Activity}
          variant="default"
        />
        <StatCard
          label="Calories"
          value="--"
          icon={Zap}
          variant="default"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Coach</CardTitle>
            <CardDescription>
              Get personalized health recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Start a conversation with your AI health coach to get insights based on your data.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Connect Wearables</CardTitle>
            <CardDescription>
              Link your devices to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Connect WHOOP, Strava, or Oura to start tracking your health metrics.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
