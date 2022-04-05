import React, { useState, useCallback, useEffect } from "react";
import "./Pokemon.css";

const pokeConfig = {
  limit: 100,
  offset: 0,
};

const Pokemon = () => {
  const [error, setError] = useState(null);
  const [pokemon, setPokemon] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // fetch name and img then create an array of objects
  const fetchPokemonHandler = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${pokeConfig.limit}&offset=${pokeConfig.offset}`
      );

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const data = await response.json();
      const pokemonArray = data.results
        .map((poke) => poke.name)
        .map((poke, index) => {
          return {
            id: poke,
            img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
              index + 1
            }.png`,
            name: poke,
          };
        });

      setPokemon(pokemonArray);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }, []);

  // fetch on mount
  useEffect(() => {
    fetchPokemonHandler();
  }, [fetchPokemonHandler]);

  let content = <p>No pokemon was found....</p>;

  // conditional rendering ui
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (error) {
    content = <p>{error}</p>;
  } else if (pokemon.length > 0) {
    content = pokemon.map((poke) => (
      <li className="card" key={poke.name}>
        <img src={poke.img} alt={poke.name} />
        <p>{poke.name}</p>
      </li>
    ));
  }

  return (
    <>
      <section>
        <button onClick={fetchPokemonHandler}>Fetch Poki</button>
      </section>
      <section>
        <ul className="card-container">{content}</ul>
      </section>
    </>
  );
};

export default Pokemon;
