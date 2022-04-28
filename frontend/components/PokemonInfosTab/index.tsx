import { useState } from 'react';
import { Capitalize } from '../../helpers/String';
import { PokemonInfosType } from '../../interfaces/Pokemon';

import styles from './styles.module.css';

export default function PokemonInfosTab({ pokemon, evolutions }: PokemonInfosType) {
	const [activeItem, setActiveItem] = useState('about');

	const getPokemonAbilities = (): string => {
		let abilities: string[] = [];
		pokemon.abilities?.map((item) => {
			abilities.push(Capitalize(item.ability.name));
		});
		return abilities.join(', ');
	};

	return (
		<div className={styles.navBar}>
			<div className={styles.navHeader}>
				<div
					className={
						activeItem == 'about'
							? `${styles.singleHeader} ${styles.active}`
							: styles.singleHeader
					}
					onClick={() => {
						setActiveItem('about');
					}}
				>
					Sobre
				</div>
				<div
					className={
						activeItem == 'status'
							? `${styles.singleHeader} ${styles.active}`
							: styles.singleHeader
					}
					onClick={() => {
						setActiveItem('status');
					}}
				>
					Status
				</div>
				<div
					className={
						activeItem == 'evolution'
							? `${styles.singleHeader} ${styles.active}`
							: styles.singleHeader
					}
					onClick={() => {
						setActiveItem('evolution');
					}}
				>
					Evolução
				</div>
			</div>
			<div className={styles.navContent}>
				<div
					className={
						activeItem == 'about'
							? `${styles.singleContent} ${styles.active}`
							: styles.singleContent
					}
				>
					<div>
						<p>Especie</p> <span>{pokemon.species?.name}</span>
					</div>
					<div>
						<p>Tamanho</p> <span>{pokemon.height}m</span>
					</div>
					<div>
						<p>Habilidades</p> <span>{getPokemonAbilities()}</span>
					</div>
					<div>
						<p>Gênero</p>{' '}
						<span>{pokemon.order && pokemon.order % 2 === 0 ? 'Fem' : 'Male'}</span>
					</div>
				</div>
				<div
					className={
						activeItem == 'status'
							? `${styles.singleContent} ${styles.active}`
							: styles.singleContent
					}
				>
					{pokemon.stats &&
						pokemon.stats.map((stat, index) => {
							return (
								<div className={styles.stat} key={`stat_${index}`}>
									<p>{Capitalize(stat.stat.name)}</p>{' '}
									<span>{stat.base_stat}</span>
								</div>
							);
						})}
				</div>
				<div
					className={
						activeItem == 'evolution'
							? `${styles.singleContent} ${styles.active}`
							: styles.singleContent
					}
				>
					{evolutions.length &&
						evolutions.map((evolution, index) => {
							return (
								<div key={`evolution_${index}`}>
									<span>{evolution}</span>
								</div>
							);
						})}
				</div>
			</div>
		</div>
	);
}
