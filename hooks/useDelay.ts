import { useState } from 'react';

export default function useDelay() {
	const [loading, setLoading] = useState(false);

	const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

	return { loading, setLoading, delay };
}
