'use client';

import { useCallback, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { customerAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

export const useCustomers = () => {
  const { currentUser } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    let cancelled = false;

    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const { data } = await customerAPI.getAll();
        if (!cancelled) setCustomers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching customers:', error);
        if (!cancelled) {
          Swal.fire({
            title: 'Error!',
            text: error.response?.data?.error || error.response?.data?.message || 'Failed to load customers',
            icon: 'error',
            confirmButtonColor: '#3085d6',
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCustomers();
    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  const addCustomer = useCallback((customer) => {
    setCustomers((previous) => [...previous, customer]);
  }, []);

  const replaceCustomer = useCallback((customer) => {
    setCustomers((previous) => previous.map((c) => (c.id === customer.id ? customer : c)));
  }, []);

  return { customers, loading, addCustomer, replaceCustomer };
};
