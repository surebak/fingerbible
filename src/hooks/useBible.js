import { useState, useEffect } from 'react';

const cache = {};

export function useBible(version, book) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!version || !book) return;

        const cacheKey = `${version}/${book}`;
        if (cache[cacheKey]) {
            setData(cache[cacheKey]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        fetch(`/data/${version}/${book}.json`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to load bible data');
                return res.json();
            })
            .then(jsonData => {
                cache[cacheKey] = jsonData;
                setData(jsonData);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError(err);
                setLoading(false);
            });
    }, [version, book]);

    return { data, loading, error };
}
