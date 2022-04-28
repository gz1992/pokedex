import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import BackSvg from '../../components/BackSvg';
import PokemonInfosTab from '../../components/PokemonInfosTab';
import { Capitalize } from '../../helpers/String';
import { PokemonInfosType } from '../../interfaces/Pokemon';
import { PokemonRepository } from '../../repositories/PokemonRepository';

import styles from './styles.module.css';

export default function PokemonInfos({ pokemon, evolutions }: PokemonInfosType) {
	const getOrderBeautify = (order: number) => {
		const strOrder = String(order);
		if (strOrder.length == 2) {
			return `0${strOrder}`;
		} else if (strOrder.length == 1) {
			return `00${strOrder}`;
		} else {
			return strOrder;
		}
	};
	return (
		<section className="container">
			<header className={styles.header}>
				<Link href="/list">
					<a>
						<BackSvg />
					</a>
				</Link>
			</header>
			<div className={styles.pokemonContent}>
				<div className={styles.title}>
					<b>{Capitalize(pokemon.name)}</b>
					<b>#{pokemon.order && getOrderBeautify(pokemon.order)}</b>
				</div>
				<div className={styles.types}>
					{pokemon.types.map((type, index: number) => {
						return (
							<span key={index} className={`singleType ${type}`}>
								{Capitalize(type)}
							</span>
						);
					})}
				</div>
				<div className={`singlePokemon big ${pokemon.types[0]}`}>
					<div className={styles.img}>
						{pokemon.img && (
							<Image src={pokemon.img} layout="fill" alt={`${pokemon.name} Image`} />
						)}
					</div>
				</div>
				<PokemonInfosTab pokemon={pokemon} evolutions={evolutions} />
			</div>
		</section>
	);
}

/**
 * @function getServerSideProps
 * @description
 */
export const getServerSideProps: GetServerSideProps = async ({ ...context }) => {
	const { name } = context.params;
	const { items } = await PokemonRepository.getPokemonByName(name, true);

	if (!items[0]) {
		return {
			redirect: {
				destination: '/list',
			},
		};
	}

	let evolutions = [];
	if (items[0].id) {
		const resp = await PokemonRepository.getEvolutionById(items[0].id);
		if (resp) {
			let finished = false;
			let evolve = resp.chain.evolves_to;
			while (!finished && evolve && evolve.length) {
				evolutions.push(Capitalize(evolve[0].species.name));
				evolve = evolve[0].evolves_to;
			}
		}
	}

	return {
		props: {
			pokemon: items[0],
			evolutions: evolutions,
		},
	};
};
