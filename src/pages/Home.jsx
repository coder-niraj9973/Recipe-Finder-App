import React, { useEffect, useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import axios from "axios";
import useLoading from '../hooks/useLoading';

function Home() {

  const [recipes, setRecipes] = useState([])
  const [total, setTotal] = useState(0)
  // const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const { loading, startLoading, stopLoading } = useLoading()


  async function fetchRecipe(skipCount, query) {
    // setLoading(true)
    startLoading()
    try {
      let url = `https://dummyjson.com/recipes?limit=6&skip=${skipCount}`

      if (query) {
        url = `https://dummyjson.com/recipes/search?limit=6&skip=${skipCount}&q=${query}`
      }

      const { data } = await axios.get(url)


      setRecipes((prev) => skipCount === 0 ? data.recipes : [...prev, ...data.recipes])
      setTotal(data.total)

    } catch (error) {
      setErrorMsg("Please try again later")
    }

    // setLoading(false)
    stopLoading()
  }

  useEffect(() => {
    fetchRecipe(0)
  }, [])

  function handleSearch(e) {
    e.preventDefault();
    // console.log(e.target.value);

    const form = new FormData(e.target)
    let query = form.get("query").trim()
    setSearchQuery(query)

    // if (query) {
    fetchRecipe(0, query)
    // }

  }

  if (loading) {
    return <p className='text-center py-6 text-muted' >Loading...</p>
  }

  if (errorMsg) {
    return <div>Please try again later</div>
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">

      <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto mb-8">
        <input
          type="text"
          name="query"
          placeholder="Search recipes..."
          className="flex-1 border border-border rounded px-3 py-2 bg-card text-text outline-none focus:border-accent"
        />
        <button type="submit" className="bg-accent hover:bg-accent-hover text-white rounded px-4 py-2 font-medium">
          Search
        </button>
      </form>

      {recipes.length === 0 && <p className='text-center py-6 text-muted' >{`No recipes found for '${searchQuery}'`}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((r) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </div>

      {recipes.length < total && (
        <div className="text-center mt-8">
          <button
            type="button"
            onClick={() => fetchRecipe(recipes.length, searchQuery)}
            className="bg-accent hover:bg-accent-hover text-white rounded px-6 py-2 font-medium"
          >
            Load More
          </button>
        </div>
      )}

    </main>
  );
}

export default Home;