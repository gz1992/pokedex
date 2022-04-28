import Pokedex from 'pokedex-promise-v2';
import { Pokemon, PokemonResponse } from '../interfaces/Pokemon';
/**
 * @const PokemonRepository
 * @description Date Repository
 */
export const PokemonRepository = {
	/**
	 * @function getPokemonList
	 * @description get pokemon list from api
	 * @returns list of pokemon
	 */
	getPokemonList: async (limit: number, offset: number): Promise<PokemonResponse> => {
		const P = new Pokedex();
		const interval = {
			limit,
			offset,
		};
		let allPokemons: Pokedex.NamedAPIResource[] = [];
		await P.getPokemonsList(interval).then((response) => {
			if (response.results.length) {
				allPokemons = response.results;
			}
		});
		return PokemonRepository.getPokemonWithNecessaryInfos(allPokemons, false);
	},
	getTypesList: async () => {
		const P = new Pokedex();
		const interval = {
			limit: 100,
			offset: 0,
		};
		console.log(interval);
		await P.getTypesList(interval).then((response) => {
			console.log(response.results);
		});
		await P.getPokemonColorsList(interval).then((response) => {
			console.log(response.results);
		});
		await P.getEndpointsList(interval).then((response) => {
			console.log(response.results);
		});
	},
	getPokemonByName: async (name: string, allInfos = false) => {
		const P = new Pokedex();

		let allPokemons: Pokedex.Pokemon | Pokedex.Pokemon[] = [];
		await P.getPokemonByName([name]) // with Promise
			.then((response) => {
				allPokemons = response;
			})
			.catch((error) => {
				// console.log('There was an ERROR: ', error);
			});
		await P.getGenderByName([name]) // with Promise
			.then((response) => {
				console.log('CHEGOU AQUI NÉ TRUTA?');
				console.log(response);
			})
			.catch((error) => {
				// console.log('There was an ERROR: ', error);
			});
		console.log(allPokemons);
		return PokemonRepository.getPokemonWithNecessaryInfos(allPokemons, allInfos);
	},
	getPokemonWithNecessaryInfos: async (
		allPokemons: Pokedex.NamedAPIResource[] | Pokedex.Pokemon[],
		allInfos = false
	) => {
		let resp: PokemonResponse = { items: [] };
		await Promise.all(
			allPokemons.map(async (pokemon, index: number) => {
				if ('url' in pokemon) {
					let newPokemon: Pokemon = {
						url: pokemon.url,
						name: pokemon.name,
						img: '',
						types: [],
					};
					await fetch(pokemon.url)
						.then((data) => data.json())
						.then((json) => {
							if (json.sprites) {
								if (json.sprites.other) {
									if (json.sprites.other.dream_world) {
										newPokemon.img =
											json.sprites.other.dream_world.front_default;
									}
								}
							}
							if (json.types) {
								json.types.map(
									(singleType: {
										slot: string;
										type: { name: string; url: string };
									}) => {
										newPokemon.types.push(singleType.type.name);
									}
								);
							}
							resp.items[index] = newPokemon;
						})
						.catch((err) => {
							console.log(err);
						});
				} else {
					let newPokemon: Pokemon = {
						name: pokemon.name,
						img: '',
						types: [],
						order: pokemon.order,
					};
					if (pokemon.sprites) {
						if (pokemon.sprites.other) {
							if (pokemon.sprites.other.dream_world) {
								newPokemon.img = pokemon.sprites.other.dream_world.front_default;
							}
						}
					}
					if (pokemon.types) {
						pokemon.types.map(
							(singleType: { slot: number; type: { name: string; url: string } }) => {
								newPokemon.types.push(singleType.type.name);
							}
						);
					}
					if (allInfos) {
						newPokemon['height'] = pokemon.height;
						newPokemon['abilities'] = pokemon.abilities;
						newPokemon['stats'] = pokemon.stats;
						newPokemon['species'] = pokemon.species;
						newPokemon['id'] = pokemon.id;
					}
					resp.items[index] = newPokemon;
				}
			})
		);
		return resp;
	},
	getEvolutionById: async (
		id: number
	): Promise<null | Pokedex.EvolutionChain | Pokedex.EvolutionChain[]> => {
		const P = new Pokedex();
		let resp = null;
		await P.getEvolutionChainById(id)
			.then((response) => {
				resp = response;
			})
			.catch((error) => {
				console.log('There was an ERROR: ', error);
			});
		return resp;
	},
	getPokemonTypes: () => {
		return {
			todos: '#ffffff',
			grass: '#7CFFD0',
			poison: '#a51fd9',
			fire: '#FF6969',
			flying: '#fff3cf',
			water: '#7CC0FF',
			bug: '#9b00b5',
			ground: '#a56b00',
			normal: '#ffdcc7',
			electric: '#f3e41c',
			fairy: '#f9cef7',
			fighting: '#971d00',
			psychic: '#880097',
			ghost: '#51015e',
			rock: '#4e0f00',
			ice: '#7cc0ff',
			dragon: '#08c1a8',
			steel: '#a2a4a5',
			dark: '#31305c',
		};
	},
};
