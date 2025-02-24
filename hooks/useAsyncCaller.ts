import { useState } from "react";

const useAsyncCaller = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);

  async function handler(func: Function) {
    try {
      setLoading(true);
      const r = await func();
      setLoading(false);
      setData(r);
      return r;
    } catch (err) {
      setError(error?.toString());
    }
    return null;
  }

  return { handler, loading, setLoading, error, data };
};

export default useAsyncCaller;
