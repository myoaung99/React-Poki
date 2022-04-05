import React, { useEffect, useReducer } from "react";
import "./Pokemon.css";
import { Card, Button } from "react-bootstrap";

const pokeConfig = {
  limit: 100,
  offset: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "MAKE_REQUEST":
      return { ...state, isLoading: true, pokemon: [] };

    case "GET_DATA":
      return { ...state, isLoading: false, pokemon: action.payload };
    case "ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        pokemon: [],
      };
    default:
      return state;
  }
};

const Pokemon = () => {
  const [state, dispatch] = useReducer(reducer, {
    isLoading: true,
    pokemon: [],
  });

  // fetch name and img then create an array of objects
  const fetchPokemonHandler = async () => {
    try {
      dispatch({ type: "MAKE_REQUEST" });
      console.log(state);

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

      dispatch({ type: "GET_DATA", payload: pokemonArray });

      console.log(state);
    } catch (error) {
      dispatch({ type: "ERROR", payload: error.message });
    }
  };

  // fetch on mount
  useEffect(() => {
    fetchPokemonHandler();
  }, []);

  let content = <p>No pokemon was found....</p>;

  // conditional rendering ui
  if (state.isLoading) {
    content = <p>Loading...</p>;
  } else if (state.error) {
    content = <p>{state.error}</p>;
  } else if (state.pokemon.length > 0) {
    content = state.pokemon.map((poke) => (
      <Card key={poke.name} style={{ width: "8rem" }}>
        <Card.Img variant="top" src={poke.img} />
        <Card.Body>
          <Card.Title>{poke.name}</Card.Title>
        </Card.Body>
      </Card>
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
