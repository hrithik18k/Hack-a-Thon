import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Empty from "../components/Empty";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import fetchData from "../helper/apiCall";
import { setLoading } from "../redux/reducers/rootSlice";
import Loading from "../components/Loading";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const getAllNotif = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(`/api/notification/getallnotifs`);
      dispatch(setLoading(false));
      setNotifications(temp || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    getAllNotif();
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <section className="appts-section">
        <div className="container">
          <h2 className="page-title">My Notifications</h2>

          {loading ? (
            <Loading />
          ) : notifications.length > 0 ? (
             <div className="table-wrapper">
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Message</th>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((ele, i) => {
                    const dateObj = new Date(ele?.createdAt);
                    return (
                      <tr key={ele?._id}>
                        <td>{i + 1}</td>
                        <td>{ele?.content}</td>
                        <td>{dateObj.toLocaleDateString()}</td>
                        <td>{dateObj.toLocaleTimeString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty />
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Notifications;
