import { useState } from 'react';

interface PlaceBet {
	id: string | undefined;
	winningTeam: string | undefined;
	odd: number;
	betAmount: number;
	estimatedWin: number;
}

interface WinningTeam {
	winningTeam: string;
	winningOdds: number;
	losingTeam: string;
	losingOdds: number;
}

export const usePlaceBets = () => {
	const [placedBetInfo, setPlacedBetInfo] = useState<PlaceBet>({
		id: '',
		winningTeam: '',
		odd: 0,
		betAmount: 0,
		estimatedWin: 0,
	});

	const selectedWinningTeam = ({
		winningTeam,
		winningOdds,
		losingTeam,
		losingOdds,
	}: WinningTeam) => {
		setPlacedBetInfo(prev => ({
			...prev,
			winningTeam: `${winningTeam} (${winningOdds})`,
			losingTeam: `${losingTeam} (${losingOdds})`,
			odd: winningOdds,
			estimatedWin: placedBetInfo.betAmount * winningOdds,
		}));
	};

	const placeBet = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPlacedBetInfo(prev => ({
			...prev,
			[e.target.id]: e.target.valueAsNumber,
			estimatedWin: e.target.valueAsNumber * placedBetInfo.odd,
		}));
	};

	return { placeBet, selectedWinningTeam, setPlacedBetInfo, placedBetInfo };
};
