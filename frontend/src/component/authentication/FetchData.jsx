import axios from "axios";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userDataActions } from "../../../store/userDataSlice";
import { URL } from "../../../config";
import { useLocation } from "react-router-dom";

function FetchData({ children }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector(state => state.userData.user);
  const cancelToken = useRef();

  useEffect(() => {
    cancelToken.current = axios.CancelToken.source();

    const fetchUser = async () => {
      if (user) return;

      dispatch(userDataActions.startLoading());
      try {
        const res = await axios.get(`${URL}/api/auth/me`, {
          withCredentials: true,
          cancelToken: cancelToken.current.token,
          headers: { "Cache-Control": "no-cache" },
        });

        if (res.status === 200 && res.data?.success && res.data?.userInfo) {
          dispatch(userDataActions.setUserData(res.data));
        } else {
          dispatch(userDataActions.removeUserData());
        }
      } catch (err) {
        if (!axios.isCancel(err)) {
          dispatch(userDataActions.removeUserData());
        }
      }
    };

    fetchUser();

    return () => {
      cancelToken.current.cancel("Operation canceled due to component unmounting.");
    };
  }, [dispatch, user, location]);

  return children;
}

export default FetchData;
