import React, { Dispatch, useState } from 'react';
import { Capitalize } from '../../helpers/String';
import { Pokemon } from '../../interfaces/Pokemon';
import { PokemonRepository } from '../../repositories/PokemonRepository';
import FilterSvg from '../FilterSvg';
import InputSubmit from '../Inputs/InputSubmit';

import styles from './styles.module.css';

type SearchComponentType = {
	filtersSelected: string[];
	setFiltersSelected: Dispatch<string[]>;
	allType: string;
	setAllPokemons: Dispatch<Pokemon[]>;
};
export default function SearchComponent({
	filtersSelected,
	setFiltersSelected,
	allType,
	setAllPokemons,
}: SearchComponentType) {
	const [openFilter, setOpenFilter] = useState(false);
	const [nameSearch, setNameSearch] = useState('');
	const removeFilter = (event: React.MouseEvent<HTMLSpanElement>) => {
		const singleFilter = (event.target as HTMLElement).closest(`.${styles.singleFilter}`);
		const filter = singleFilter?.querySelector(`.${styles.name}`)?.innerHTML.trim();
		let finalFilters = [allType];
		if (filtersSelected.length > 1 && filter) {
			finalFilters = JSON.parse(JSON.stringify(filtersSelected));
			finalFilters.splice(finalFilters.indexOf(filter), 1);
		} else if (!filter) {
			finalFilters = filtersSelected;
		}
		setFiltersSelected(finalFilters);
	};

	const toggleType = (e: React.MouseEvent<HTMLDivElement>, type: string) => {
		let copyFiltersSelected = JSON.parse(JSON.stringify(filtersSelected));
		const capitalizedType = Capitalize(type);
		if (capitalizedType === allType) {
			cleanFilters();
		} else {
			const indexType = filtersSelected.indexOf(capitalizedType);
			if (indexType === -1) {
				copyFiltersSelected.push(capitalizedType);
				e.currentTarget.classList.add(styles.active);
			} else {
				copyFiltersSelected.splice(indexType, 1);
				e.currentTarget.classList.remove(styles.active);
			}

			const allIndexOf = copyFiltersSelected.indexOf(allType);
			if (allIndexOf !== -1 && copyFiltersSelected.length > 1) {
				copyFiltersSelected.splice(allIndexOf, 1);
				e.currentTarget
					.closest(`.${styles.allFiltersType} .todos`)
					?.classList.remove('active');
			}
			if (!copyFiltersSelected.length) {
				copyFiltersSelected.push(allType);
				document
					.querySelector(`.${styles.allFiltersType} .todos`)
					?.classList.add(styles.active);
			}
			setFiltersSelected(copyFiltersSelected);
		}
	};

	const searchPokemon = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (nameSearch != '') {
			const { items } = await PokemonRepository.getPokemonByName(nameSearch);
			setAllPokemons(items);
		} else {
			const { items } = await PokemonRepository.getPokemonList(12, 0);
			setAllPokemons(items);
		}
	};

	const cleanFilters = () => {
		setFiltersSelected([allType]);
		const allFilters = Array.from(
			document.querySelectorAll(`.${styles.allFiltersType} .${styles.active}`)
		);
		allFilters.forEach((type) => {
			type.classList.remove(styles.active);
		});
		document.querySelector(`.${styles.allFiltersType} .todos`)?.classList.add(styles.active);
	};

	return (
		<div className="">
			<div
				className={`${styles.searchComponent} d-flex justify-content-start align-items-center gap-3`}
			>
				<form
					onSubmit={(e) => {
						searchPokemon(e);
					}}
				>
					<input
						type="text"
						placeholder="Buscar Pokémon"
						onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
							setNameSearch(e.currentTarget.value);
						}}
					/>
					<button type="submit" style={{ display: 'none' }}></button>
				</form>
				<span
					onClick={() => {
						setOpenFilter(true);
					}}
				>
					<FilterSvg />
				</span>
			</div>
			<div className={styles.selectedFilters}>
				{filtersSelected.length &&
					filtersSelected.map((filter: string, index: number) => {
						return (
							<div className={styles.singleFilter} key={`filter${index}`}>
								<p className={styles.name}>{filter}</p>
								<div className={styles.removeBtn}>
									<span
										className={styles.removeFilter}
										onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
											removeFilter(e);
										}}
									>
										&#215;
									</span>
								</div>
							</div>
						);
					})}
			</div>
			{openFilter && (
				<FilterMenu
					setOpenFilter={setOpenFilter}
					filtersSelected={filtersSelected}
					toggleType={toggleType}
					cleanFilters={cleanFilters}
				/>
			)}
		</div>
	);
}

type FilterMenuType = {
	setOpenFilter: Dispatch<boolean>;
	filtersSelected: string[];
	toggleType: Function;
	cleanFilters: Function;
};
function FilterMenu({ setOpenFilter, filtersSelected, toggleType, cleanFilters }: FilterMenuType) {
	const allPokemonTypes = PokemonRepository.getPokemonTypes();

	return (
		<aside className={styles.filterOptions}>
			<div>
				<div className={styles.title}>
					<span>
						Filtro
						<span
							className={styles.clean}
							onClick={() => {
								cleanFilters();
							}}
						>
							Limpar filtros
						</span>
					</span>
					<span
						onClick={() => {
							setOpenFilter(false);
						}}
					>
						&#215;
					</span>
				</div>
				<div className={styles.content}>
					<span>Tipo</span>
					<div className={styles.allFiltersType}>
						<>
							{allPokemonTypes &&
								Object.keys(allPokemonTypes).map((type, index: number) => {
									const typeCapitalized = Capitalize(type);
									let filterClass = `${styles.singleFilterType} ${type}`;
									if (filtersSelected.indexOf(typeCapitalized) !== -1) {
										filterClass += ` ${styles.active}`;
									}
									return (
										<div
											className={filterClass}
											key={index}
											onClick={(e: React.MouseEvent<HTMLDivElement>) => {
												toggleType(e, type);
											}}
										>
											{type}
										</div>
									);
								})}
						</>
					</div>
				</div>
			</div>
			<InputSubmit value="Aplicar" />
		</aside>
	);
}
