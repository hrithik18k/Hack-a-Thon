"use client";

import { Protected } from "../../middleware/route";
import React, { useEffect, useState } from "react";
import EditorialShell from "../../components/editorial/EditorialShell";
import Empty from "../../components/Empty";
import Loading from "../../components/Loading";
import fetchData from "../../helper/apiCall";
import { getApiBaseUrl } from "@/lib/apiBaseUrl";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getAllNotif() {
      try {
        setLoading(true);
        const data = await fetchData("/api/notification/getallnotifs");
        setNotifications(data || []);

        const baseUrl = getApiBaseUrl();
        await fetch(`${baseUrl}/api/notification/markallread`, {
          method: "PUT",
          credentials: "include",
        });
        window.dispatchEvent(new Event("notifications_read"));
      } finally {
        setLoading(false);
      }
    }

    getAllNotif();
  }, []);

  return (
    <EditorialShell>
      <main className="editorial-page">
        <section className="editorial-page-hero">
          <div className="editorial-shell">
            <span className="editorial-eyebrow">Inbox</span>
            <h1 className="editorial-page-title">Notifications are grouped into a clearer care activity feed.</h1>
            <p className="editorial-lede">
              Booking updates, approval messages, and record alerts now read like a timeline instead of a utility table.
            </p>
          </div>
        </section>

        <section className="editorial-section editorial-section-tight">
          <div className="editorial-shell editorial-narrow-shell">
            {loading ? (
              <Loading label="Loading notifications..." />
            ) : notifications.length ? (
              <div className="editorial-notification-list">
                {notifications.map((notification) => {
                  const dateObj = new Date(notification?.createdAt);
                  const isUnread = notification?.isRead === false;

                  return (
                    <article key={notification?._id} className={`editorial-notification-card ${isUnread ? "is-unread" : ""}`}>
                      <div>
                        <h3 className="editorial-card-title">Care update</h3>
                        <p>{notification?.content}</p>
                      </div>
                      <div className="editorial-notification-meta">
                        <span>{dateObj.toLocaleDateString()}</span>
                        <span>{dateObj.toLocaleTimeString()}</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <Empty title="No notifications yet" message="Alerts and booking messages will appear here." />
            )}
          </div>
        </section>
      </main>
    </EditorialShell>
  );
};

const ProtectedNotifications = () => <Protected><Notifications /></Protected>;

export default ProtectedNotifications;
