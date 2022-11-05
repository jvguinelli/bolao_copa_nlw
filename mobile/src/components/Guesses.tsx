import { FlatList, useToast } from 'native-base';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Game, GameProps } from './Game';
import { Loading } from './Loading';

interface Props {
  poolId: string;
}

export function Guesses({ poolId }: Props) {

    const [ isLoading, setIsLoading ] = useState(false)
    const [ games, setGames ] = useState<GameProps[]>([])
    const [ firstTeamPoints, setFirstTeamPoints ] = useState('')
    const [ secondTeamPoints, setSecondTeamPoints ] = useState('')
    
    const toast = useToast()

    async function fetchGames() {
        try {
            setIsLoading(true)

            const response = await api.get(`/pools/${poolId}/games`)
            console.log("## RESPOSTA ##")
            console.log(response.data)
            setGames(response.data.games)

        } catch (error) {
            console.log(error)
            toast.show({
                title: 'Não possível carregar os jogos!',
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsLoading(false)
        }
    }

    async function handleGuessConfirm(gameId: String) {
        try {
            if (!firstTeamPoints.trim() || !secondTeamPoints.trim())
            return toast.show({
                title: 'Informe o placar do palpite!',
                placement: 'top',
                bgColor: 'red.500'
            })

            const response = await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
                firstTeamPoints: Number(firstTeamPoints),
                secondTeamPoints: Number(secondTeamPoints)
            })

            toast.show({
                title: 'Palpite enviado com sucesso!',
                placement: 'top',
                bgColor: 'green.500'
            })

            fetchGames()
        } catch (error) {
            console.log(error)
            toast.show({
                title: 'Não possível enviar o palpite!',
                placement: 'top',
                bgColor: 'red.500'
            })
        } 
    }

    useEffect(() => {
        fetchGames()
    }, [poolId])

    if (isLoading) {
        return <Loading />
    }

    if (isLoading) {
        return <Loading />
    }

  return (
    <FlatList 
      data={games}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Game 
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}
    />
  );
}
