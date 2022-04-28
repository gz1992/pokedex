import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import SearchComponent from '../../components/Search';
import { Capitalize } from '../../helpers/String';
import { Pokemon } from '../../interfaces/Pokemon';

import logo from '../../public/imgs/logo.png';
import { PokemonRepository } from '../../repositories/PokemonRepository';

import styles from './styles.module.css';

type ListTypeProps = {
	pokemons: Pokemon[];
};

export default function List({ pokemons }: ListTypeProps) {
	const allType = 'Todos';
	const [allPokemons, setAllPokemons] = useState(pokemons);
	const [filtersSelected, setFiltersSelected] = useState([allType]);
	// const pokemonTypes = PokemonRepository.getPokemonTypes();
	const [page, setPage] = useState(0);

	const fetchMoreData = async () => {
		let nextPage = page + 12;
		let pokemonsConcat = JSON.parse(JSON.stringify(allPokemons));
		let isAllType = filtersSelected.indexOf(allType) !== -1;
		if (isAllType) {
			const { items } = await PokemonRepository.getPokemonList(12, nextPage);
			pokemonsConcat = pokemonsConcat.concat(items);
		} else {
			let foundPokemon = false;
			while (nextPage < 700 && !foundPokemon) {
				const { items } = await PokemonRepository.getPokemonList(12, nextPage);
				pokemonsConcat = pokemonsConcat.concat(items);
				items.every((pokemon) => {
					console.log(pokemon);
					foundPokemon = isPokemonAllowed(pokemon);
					return !foundPokemon;
				});
				if (!foundPokemon) {
					nextPage += 12;
				}
			}
		}
		setPage(nextPage);
		setAllPokemons(pokemonsConcat);
	};

	const isPokemonAllowed = (pokemon: Pokemon): boolean => {
		let typeAllowed = false;
		pokemon.types.map((type) => {
			const typeCapitalized = Capitalize(type);
			if (filtersSelected.indexOf(typeCapitalized) !== -1) {
				typeAllowed = true;
			}
		});
		return typeAllowed;
	};

	return (
		<div className="container">
			<div className={styles.header}>
				<header className="d-flex justify-content-center px-2 py-3">
					<Image src={logo} alt="Logo pokemon" />
				</header>
				<SearchComponent
					filtersSelected={filtersSelected}
					setFiltersSelected={setFiltersSelected}
					allType={allType}
					setAllPokemons={setAllPokemons}
				/>
			</div>
			<div className={styles.fakeHeader}></div>
			<div className={styles.allPokemons}>
				{allPokemons.length ? (
					<InfiniteScroll
						dataLength={allPokemons.length}
						next={fetchMoreData}
						hasMore={true}
						style={{
							display: 'grid',
							gridTemplateColumns: '48% 48%',
							gap: '1rem',
							marginTop: '1.5rem',
						}}
						loader={<h4 style={{ textAlign: 'center' }}>Loading...</h4>}
					>
						{allPokemons.map((pokemon: Pokemon, index: number) => {
							let typeAllowed = true;
							if (filtersSelected.indexOf(allType) === -1) {
								typeAllowed = isPokemonAllowed(pokemon);
							}

							return (
								typeAllowed && (
									<Link href={`/pokemon/${pokemon.name}`}>
										<a
											className={`singlePokemon ${pokemon.types[0]}`}
											key={index}
										>
											<div className={styles.img}>
												{pokemon.img && (
													<Image
														src={pokemon.img}
														layout="fill"
														alt={`${pokemon.name} Image`}
													/>
												)}
											</div>
											<p className={styles.name}>
												<strong>{pokemon.name}</strong>
											</p>
										</a>
									</Link>
								)
							);
						})}
					</InfiniteScroll>
				) : (
					<div className={styles.emptyPokemons}>
						Não há nenhum pokemon nessas configurações, pesquise novamente!
					</div>
				)}
			</div>
		</div>
	);
}

export async function getStaticProps() {
	await PokemonRepository.getTypesList();
	const { items } = await PokemonRepository.getPokemonList(12, 0);
	return {
		props: {
			pokemons: items,
		},
	};
}
