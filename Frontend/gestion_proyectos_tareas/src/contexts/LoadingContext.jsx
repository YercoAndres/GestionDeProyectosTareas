import { createContext, useContext, useState } from "react";
import Loading from "../components/Loading";

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [loading, set] = useState(false);
  return (
    <LoadingContext.Provider value={{ loading, set }}>
      {children}
      {loading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <Loading />
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => useContext(LoadingContext);