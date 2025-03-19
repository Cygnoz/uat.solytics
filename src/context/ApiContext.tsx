import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import useApi from "../Hooks/useApi";
import { endpoints } from "../Services/apiEndpoints";
import { useOrg } from "./OrgContext";
import { useResponse } from "./ResponseContext";

type ApiContextType = {
    allCategory?: any;
    allArticles?:any
  refreshContext: (options?: {category?: boolean; articles?: boolean; }) => Promise<void>;
};

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const { orgData } = useOrg();
  // API hooks
  const { request: getAllCatgory } = useApi("get", 3001);
  const { request: getAllArticles } = useApi("get", 3001);
  // State variables
    const {setLoading}=useResponse()
  const [allCategory, setAllCategory] = useState<any[]>([]);
  const [allArticles, setAllArticles] = useState<any[]>([]);  
  // Use a ref to store previous fetched data to prevent unnecessary API calls
  const prevDataRef = useRef<any>(null);

  // Fetching Data Function
  const fetchData = useCallback(async (options?: {  category?: boolean;articles?:boolean }) => {
    try {
        setLoading(true)
      const fetchPromises = [];

      if (!options || options.category) {
        fetchPromises.push(getAllCatgory(`${endpoints.CATEGORY}?categoryType=KnowledgeBase&project=${orgData?.project_name}`).then(response => ({ category: response?.response?.data?.data || [] })));
      }
      if (!options || options.articles) {
        fetchPromises.push(getAllArticles(`${endpoints.ARTICLE}?project=${orgData?.project_name}`).then(response => ({ articles: response?.response?.data?.data || [] })));
      }

      const results = await Promise.all(fetchPromises);

      const newData:any = results.reduce((acc, result) => ({ ...acc, ...result }), {});

      // Compare new data with previous data to avoid unnecessary state updates
      if (JSON.stringify(prevDataRef.current) !== JSON.stringify(newData)) {
        if (newData.category) setAllCategory(newData.category);
        if (newData.articles) setAllArticles(newData.articles);
        prevDataRef.current = newData;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }finally{
        setLoading(false)
    }
  }, [orgData]);

  


  const refreshContext = useCallback(async (options?: { category?: boolean;articles?:boolean }) => {
    try {
      await fetchData(options);
    } catch (error) {
      console.error("Error refreshing context data:", error);
    }
  }, [fetchData]);

  useEffect(() => {
    if (orgData) {
      fetchData(); // Initial data fetch
    }
  }, [orgData, fetchData]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    allCategory,
    allArticles,
    refreshContext
  }), [allCategory,allArticles, refreshContext]);

  return <ApiContext.Provider value={contextValue}>{children}</ApiContext.Provider>;
};

export const useRegularApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};