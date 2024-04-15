export const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
  };
  