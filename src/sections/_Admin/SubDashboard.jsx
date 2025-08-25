"use client"

import React, { useEffect, useMemo } from 'react';
import { HiOutlineUser } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import {
  useGetAllUsersQuery,
  useGetPendingVendorsQuery,
  useGetAllVendorsQuery,
  useGetRecentActivitiesQuery,
} from '@/features/admin/adminAPI';
import Loader from "@/components/shared/Loader";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const getColor = (type = '') => {
  const typeLC = type.toLowerCase();
  if (typeLC.includes('vendor')) return 'yellow';
  if (typeLC.includes('user')) return 'green';
  if (typeLC.includes('review')) return 'red';
  if (typeLC.includes('blog')) return 'blue';
  if (typeLC.includes('booking')) return 'purple';
  if (typeLC.includes('inquiry')) return 'orange';
  return 'gray';
};

const colorMap = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-400',
  blue: 'bg-blue-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  gray: 'bg-gray-400',
};

const formatTimeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  if (hours > 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  if (mins > 0) return `${mins} ${mins === 1 ? 'minute' : 'minutes'} ago`;
  return 'Just now';
};

const getLast30Days = () => {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
};

const SubDashboard = () => {
  const router = useRouter();

  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery();
  const { data: pendingVendorsData } = useGetPendingVendorsQuery();
  const { data: vendorsData, isLoading: vendorsLoading } = useGetAllVendorsQuery();
  const {
    data: activityData,
    isLoading: activityLoading,
    error: activityError,
    isSuccess: activitySuccess,
    isError: activityIsError,
  } = useGetRecentActivitiesQuery();

  useEffect(() => {
    if (activityIsError && activityError) {
      console.error('Activity Error:', activityError);
    }
  }, [activityIsError, activityError]);

  const formattedActivity = useMemo(() => {
    if (!activitySuccess || !activityData?.activities) {
      return [];
    }
    
    return activityData.activities
      .map(act => ({
        ...act,
        time: formatTimeAgo(act.createdAt),
        color: getColor(act.type)
      }))
      .slice(0, 10);
  }, [activityData, activitySuccess]);

  const analyticsData = useMemo(() => {
    const last30 = getLast30Days();
    const userCounts = Object.fromEntries(last30.map(date => [date, 0]));
    const vendorCounts = Object.fromEntries(last30.map(date => [date, 0]));

    usersData?.users?.forEach(u => {
      const d = new Date(u.createdAt);
      if (!isNaN(d)) {
        const date = d.toISOString().slice(0, 10);
        if (userCounts[date] !== undefined) userCounts[date]++;
      }
    });

    vendorsData?.vendors?.forEach(v => {
      const rawDate = v.appliedDate || v.created_at || v.created_on || v.createdAt;
      const d = new Date(rawDate);
      if (!isNaN(d)) {
        const date = d.toISOString().slice(0, 10);
        if (vendorCounts[date] !== undefined) vendorCounts[date]++;
      }
    });

    return last30.map(date => ({
      date: new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      users: userCounts[date],
      vendors: vendorCounts[date],
    }));
  }, [usersData, vendorsData]);

  const categories = useMemo(() => {
    if (!vendorsData?.vendors) return [];
    
    const counts = {};
    vendorsData.vendors.forEach(v => {
      const cat = v.category || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const total = vendorsData.vendors.length || 1;
    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        percent: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.percent - a.percent);
  }, [vendorsData]);

  const recentUsers = useMemo(() => {
    if (!usersData?.users) return [];
    
    return usersData.users
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3)
      .map(user => ({
        name: user.name || user.fullName || 'No Name',
        email: user.email || 'No Email',
        type: user.role === 'vendor' ? 'Vendor' : 'User',
        date: new Date(user.createdAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
        }),
      }));
  }, [usersData]);

  if (usersLoading || vendorsLoading || activityLoading) {
    return <Loader fullScreen />;
  }

  const tasks = [
    {
      title: 'Vendor Approvals',
      detail: `${pendingVendorsData?.vendors?.length || 0} vendors waiting for approval`,
      action: 'Review Now',
      color: 'bg-yellow-100 border-yellow-300 text-yellow-500',
      onClick: () => router.push('/admin/pending_vendor_approvals'),
    },
    {
      title: 'Reported Reviews',
      detail: '3 reviews flagged for moderation',
      action: 'Moderate',
      color: 'bg-red-100 border-red-300 text-red-500',
      onClick: () => router.push('/admin/review_moderation'),
    },
    {
      title: 'Content Updates',
      detail: '6 entries pending to review',
      action: 'View Content',
      color: 'bg-blue-100 border-blue-300 text-blue-500',
      onClick: () => router.push('/admin/content_management'),
    },
  ];

  return (
    <div className="space-y-4 text-sm text-gray-800 font-serif p-2 sm:p-4">
      {/* Top Section: Chart + Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="md:col-span-1 lg:col-span-2 bg-white p-4 rounded shadow-sm">
          <h2 className="font-semibold text-md mb-1">Daily Activity Overview</h2>
          <p className="text-gray-500 text-xs mb-4">User registrations and vendor signups over the last 30 days</p>
          <div className="h-[200px] md:h-[300px] lg:h-[400px]">
            <ResponsiveContainer width="100%" height="100%" style={{marginLeft:'-50px'}} minWidth={320}>
              <LineChart data={analyticsData}>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#0f4c81" name="Users" />
                <Line type="monotone" dataKey="vendors" stroke="#DEBF78" name="Vendors" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-md shadow-sm">
          <h2 className="font-semibold text-md mb-1">Recent Activity</h2>
          <p className="text-gray-500 text-xs mb-4">Latest actions on the platform</p>
          {activityLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : formattedActivity.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40">
              <p className="text-gray-400">No recent activity found</p>
            </div>
          ) : (
            <div className="space-y-4 overflow-auto max-h-[400px] pr-2">
              {formattedActivity.map((item, i) => (
                <div key={i} className="relative pl-4 border-l-2 hover:bg-gray-50 p-2 rounded transition-colors">
                  <div className={`absolute left-[-5px] top-3 w-2.5 h-2.5 rounded-full ${colorMap[item.color]}`} />
                  <div>
                    <p className="font-medium text-sm text-gray-900">{item.type}</p>
                    <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                    <p className="text-gray-400 text-xs mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            className="mt-4 w-full text-gray-800 border border-[#0f4c81] rounded py-1.5 text-xs hover:bg-[#DEBF78] transition duration-200"
            onClick={() => router.push('/admin/activity_logs')}
          >
            View All Activity
          </button>
        </div>
      </div>

      {/* Bottom Section: Users, Tasks, Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow border p-4 w-full">
          <h2 className="text-xl font-semibold text-gray-800">Recent Users or Vendors</h2>
          <p className="text-sm text-gray-500 mb-4">Newly registered users or vendors</p>
          <div className="space-y-4">
            {usersLoading || vendorsLoading ? (
              <div>Loading...</div>
            ) : (
              [...(usersData?.users || []), ...(vendorsData?.vendors || [])]
                .map(item => {
                  const dateRaw = item.createdAt || item.created_at || item.created_on || item.appliedDate;
                  return {
                    id: item._id || item.id,
                    name: item.name || item.fullName || item.businessName || 'No Name',
                    email: item.email || 'No Email',
                    type: vendorsData?.vendors?.some(v => v._id === item._id) ? 'Vendor' : 'User',
                    date: new Date(dateRaw),
                    dateStr: new Date(dateRaw).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'numeric',
                      year: 'numeric',
                    }),
                  };
                })
                .filter(item => !isNaN(item.date))
                .sort((a, b) => b.date - a.date)
                .slice(0, 3)
                .map((item, index) => (
                  <div key={item.id || index} className="flex items-start space-x-3 border-b pb-4 last:border-none">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <HiOutlineUser size={30} className="text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full">
                          {item.type}
                        </span>
                        <span className="text-xs text-gray-400">{item.dateStr}</span>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
          <button
            className="mt-4 w-full border border-gray-300 rounded py-2 text-sm text-gray-700 hover:bg-[#DEBF78] transition"
            onClick={() => router.push('/admin/user_management')}
          >
            View All Users
          </button>
        </div>

        <div className="bg-white p-3 rounded shadow-sm w-full">
          <h2 className="font-semibold text-md mb-2">Pending Tasks</h2>
          <p className="text-gray-500 text-xs mb-2">Items that need your attention</p>
          <ul className="text-xs space-y-3" style={{marginLeft:'-35px', minWidth: '320px'}}>
            {tasks.map((task, i) => (
              <li key={i} className={`p-2 border-l-4 ${task.color} rounded shadow-sm`}>
                <p className="font-medium text-sm">{task.title}</p>
                <p className="text-gray-600 text-xs">{task.detail}</p>
                <button className="text-blue-700 text-xs nav-Link mt-1" onClick={task.onClick}>
                  {task.action}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-3 rounded shadow-sm w-full">
          <h2 className="font-semibold text-md mb-2">Popular Categories</h2>
          <ul className="space-y-3 text-xs pl-0" style={{marginLeft:'-35px', minWidth: '320px'}}>
            {vendorsLoading ? (
              <div>Loading...</div>
            ) : !categories || categories.length === 0 ? (
              <div>No categories found.</div>
            ) : (
              categories.map((cat, i) => (
                <li key={i}>
                  <div className="flex justify-between mb-1">
                    <span>{cat.name}</span>
                    <span>{cat.percent}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-4 rounded">
                    <div
                      className="bg-[#0f4c81] h-4 rounded"
                      style={{ width: `${cat.percent}%` }}
                    ></div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SubDashboard;
