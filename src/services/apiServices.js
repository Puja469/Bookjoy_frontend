import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


export const registerUser = async (registrationData) => {
    const response = await apiClient.post("/user", registrationData);
    return response.data;
  };
  
 
  export const loginUser = async (loginData) => {
    const response = await apiClient.post("/user/sign", loginData);
    return response.data;
  };
  
  export const updateUser = async (userId, token, formData) => {
    const response = await apiClient.put(`/user/${userId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", 
      },
    });
    return response.data;
  };
  

  
  
  export const sendVerificationOtp = async (email) => {
    const response = await apiClient.post("/user/send-otp", { email });
    return response.data;
  };
  
  
  export const verifyOtp = async (otpData) => {
    const response = await apiClient.post("/user/verify-email", otpData);
    return response.data;
  };
  
  
  export const sendPasswordResetOtp = async (email) => {
    const response = await apiClient.post("/user/forgot-password", { email });
    return response.data;
  };
  
  
  export const resetPassword = async (resetData) => {
    const response = await apiClient.post("/user/reset-password", resetData);
    return response.data;
  };
  
 
export const fetchNotifications = async (userId, token) => {
  const response = await apiClient.get(`/notifications?userId=${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};



export const markNotificationsAsRead = async (userId, token) => {
  const response = await apiClient.put(
    `/notifications/markAsRead?userId=${userId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Fetch User Details
export const fetchUserDetails = async (userId, token) => {
  const response = await apiClient.get(`/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      
    },
  });
  return response.data;
};

// Fetch all events (public)
export const fetchAllEvents = async () => {
  const response = await apiClient.get("/event");
  return response.data;
};

// Create a new event (admin only, with image upload)
export const createEvent = async (eventData, token) => {
  const response = await apiClient.post("/event", eventData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data", 
    },
  });
  return response.data;
};

// Fetch venues filtered by event name (e.g., Wedding, Birthday)
export const fetchVenuesByEvent = async (eventName) => {
  const response = await apiClient.get(`/venue?event=${eventName}`);
  return response.data;
};

// Fetch a single venue by ID
export const fetchVenueById = async (venueId) => {
  const response = await apiClient.get(`/venue/${venueId}`);
  return response.data;
};
export const toggleFavoriteVenue = async (userId, venueId, token) => {
  const response = await apiClient.put(
    `/user/${userId}/favorites`,
    { venueId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Fetch favorite venues for a user
export const getFavoriteVenues = async (userId, token) => {
  const response = await apiClient.get(`/user/${userId}/favorites`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createBooking = async (bookingData, token) => {
  const response = await apiClient.post("/booking", bookingData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


export const getBookingById = async (bookingId) => {
  const response = await apiClient.get(`/booking/${bookingId}`);
  return response.data;
};


export const updatePaymentStatus = async (bookingId, status) => {
  const response = await apiClient.patch(`/booking/${bookingId}/payment-status`, {
    status,
  });
  return response.data;
};


export const fetchAllBookings = async (token) => {
  const response = await apiClient.get("/booking", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchBookingsByUser = async (userId, token) => {
  const response = await apiClient.get(`/booking/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


export const updateBookingStatus = async (bookingId, statusData, token) => {
  const response = await apiClient.put(`/booking/${bookingId}`, statusData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


export const deleteBooking = async (bookingId, token) => {
  const response = await apiClient.delete(`/booking/${bookingId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


export const createMenuTier = async (tierData, token) => {
  const response = await apiClient.post("/menutier", tierData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


export const fetchMenuTiersByVenue = async (venueId) => {
  const response = await apiClient.get(`/menutier/${venueId}`);
  return response.data;
};


export const deleteMenuTier = async (tierId, token) => {
  const response = await apiClient.delete(`/menutier/${tierId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchMenuItemsByTier = async (tierId) => {
  const response = await apiClient.get(`/menutier/by-tier/${tierId}`);
  return response.data;
};

export const fetchBookedDates = async (venueId) => {
  const response = await apiClient.get(`/booking/venue/${venueId}/booked-dates`);
  return response.data; 
};

export const incrementViewCount = async (venueId, userId = null) => {
  const response = await apiClient.post(`/venue/${venueId}/views`, {
    userId: userId, 
  });
  return response.data;
};

export const getViewCount = async (venueId) => {
  const response = await apiClient.get(`/venue/${venueId}/views`);
  return response.data;
};