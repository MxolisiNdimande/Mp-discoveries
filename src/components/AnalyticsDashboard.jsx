import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { analyticsData, devices, destinations } from '../lib/mockData';
import { Activity, Users, MousePointerClick, Mail, TrendingUp, Monitor, AlertCircle, CheckCircle } from 'lucide-react';

export function AnalyticsDashboard() {
  const statusColors = {
    online: '#22c55e',
    offline: '#ef4444',
    maintenance: '#f59e0b'
  };

  const chartColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  const engagementByDestination = destinations.map((dest, idx) => ({
    name: dest.name,
    interactions: dest.views,
    scans: dest.scans,
    emails: dest.emailsSent
  }));

  const deviceStatusData = Object.entries(analyticsData.deviceStatus).map(([status, count]) => ({
    name: status,
    value: count
  }));

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
    
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    return `${Math.floor(diff / 60)}h ago`;
  };

  return (
    <div className="h-full overflow-auto bg-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1>Analytics Dashboard</h1>
          <p className="text-muted-foreground">Real-time Mpumalanga tourism metrics and engagement data</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Total Interactions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl">{analyticsData.totalInteractions.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  12.5%
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Past 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">QR Code Scans</CardTitle>
              <MousePointerClick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl">{analyticsData.totalScans.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  8.3%
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">24.5% conversion rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Emails Sent</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl">{analyticsData.totalEmails.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  15.2%
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">13.5% conversion rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Avg. Engagement</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl">{analyticsData.avgEngagementTime}</div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  5.7%
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Per session duration</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Interactions Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Interactions</CardTitle>
              <CardDescription>User engagement over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.dailyInteractions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Destinations */}
          <Card>
            <CardHeader>
              <CardTitle>Top Destinations</CardTitle>
              <CardDescription>Most popular destinations this week</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analyticsData.topDestinations.map((dest, idx) => (
                <div key={dest.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">
                        {idx + 1}
                      </div>
                      <span>{dest.name}</span>
                    </div>
                    <span>{dest.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${dest.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Engagement by Destination */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement by Destination</CardTitle>
            <CardDescription>Interactions, scans, and emails per destination</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={engagementByDestination}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="interactions" fill="#3b82f6" name="Views" />
                <Bar dataKey="scans" fill="#8b5cf6" name="QR Scans" />
                <Bar dataKey="emails" fill="#ec4899" name="Emails" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Device Status Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Device Status</CardTitle>
              <CardDescription>Network health overview</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={deviceStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {deviceStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={statusColors[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>System Summary</CardTitle>
              <CardDescription>Current operational status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Online Devices</p>
                    <p className="text-xl">{analyticsData.deviceStatus.online}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Offline Devices</p>
                    <p className="text-xl">{analyticsData.deviceStatus.offline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Monitor className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Maintenance</p>
                    <p className="text-xl">{analyticsData.deviceStatus.maintenance}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">System Uptime</p>
                    <p className="text-xl">99.8%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Device Monitoring Table */}
        <Card>
          <CardHeader>
            <CardTitle>Device Monitoring</CardTitle>
            <CardDescription>Real-time status of all kiosks and signage</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Terminal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Interactions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-muted-foreground" />
                        {device.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {device.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{device.location}</TableCell>
                    <TableCell>{device.terminal}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-2 w-2 rounded-full"
                          style={{ 
                            backgroundColor: statusColors[device.status]
                          }}
                        />
                        <Badge 
                          variant={
                            device.status === 'online' ? 'default' :
                            device.status === 'offline' ? 'destructive' : 'secondary'
                          }
                          className="capitalize"
                        >
                          {device.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{formatTime(device.lastActive)}</TableCell>
                    <TableCell>{device.interactions.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}