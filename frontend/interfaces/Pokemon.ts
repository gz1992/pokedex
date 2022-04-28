/**
 * @type AnalyticsParameters
 * @access Public
 * @description Type
 */

import { AbilityElement, NamedAPIResource, StatElement } from 'pokedex-promise-v2';

export type PokemonResponse = {
	items: Pokemon[];
};

export type Pokemon = {
	name: string;
	img: string | null;
	types: string[];
	url?: string;
	order?: number;
	abilities?: AbilityElement[];
	height?: number;
	stats?: StatElement[];
	species?: NamedAPIResource;
	id?: number;
};

export type PokemonInfosType = {
	pokemon: Pokemon;
	evolutions: string[];
};
