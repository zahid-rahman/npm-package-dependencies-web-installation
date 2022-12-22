import React, { useEffect, useState } from "react";
export default function App() {
  const [dependencies, setDependencies] = useState<any>([]);
  const [searchContext, setSearchContext] = useState<any>("");
  const [text, setText] = useState<string>("");
  const [error, setError] = useState<string>("");
  useEffect(() => {
    // const getAll = async () => {
    //   if (text) {
    //     try {
    //       const data = await fetch("https://registry.npmjs.org/" + text);
    //       const res = await data.json();
    //       console.log("RES:", res);
    //       if (res) {
    //         setIsLoading(false)
    //         setDependencies((prev: any) => {
    //           return [
    //             ...prev,
    //             {
    //               name: res.name,
    //               version: res["dist-tags"].latest
    //             }
    //           ];
    //         });
    //       } else {
    //         setIsLoading(true)
    //       }
    //     }
    //     catch(error) {
    //       console.error(error)
    //     }
    //   }
    // };
    // getAll();

    const getNpmPackageV2 = async () => {
      if (text) {
        try {
          const data = await fetch(`https://api.npms.io/v2/search/suggestions?q=${text}`);
          const res = await data.json();
          console.log("RES:", res[0]);
          if (res.length > 0) {
            setDependencies((prev: any) => {
              return [
                ...prev,
                {
                  name: res[0].package.name,
                  version: res[0].package.version
                }
              ];
            });
          } else {
            setError("not found")
          }
        }
        catch (error) {
          console.error(error)
        }
      }
    }

    getNpmPackageV2()
  }, [text]);


  const onChangeHandler = (event: any) => {
    setSearchContext(event.target.value);
  };

  const getUnique = (arr: any[]) => {
    let uniqueArr = arr.filter((obj, pos, arr) => {
      return arr
        .map(mapObj => mapObj.name)
        .indexOf(obj.name) == pos;
    });
    console.log("unique", uniqueArr)
    return uniqueArr;
  };

  const filteredDependencies = getUnique(dependencies)
  const deleteItem = (arr: any[], index: number) => {
    arr.splice(index, 1)
    setDependencies(arr)
    console.log("new",arr)
  }


  console.log(filteredDependencies)

  return (
    <div className="App">
      <h1>Npm package adding functionality</h1>
      <input
        placeholder="Enter your package name"
        list="ice-cream-flavors"
        id="ice-cream-choice"
        name="ice-cream-choice"
        onChange={onChangeHandler}
        value={searchContext}
      />

      <button
        onClick={() => {
          setText(searchContext);
          setSearchContext("");
          setError("")
        }}
      >
        Add dependencies
      </button>
      {filteredDependencies.map((dependency: any, index: number) => {
        return (
          <div key={index}>
            <span>"{dependency?.name}"</span>
            <span> : </span>
            <span>"{dependency?.version}"</span>
            <button style={{ margin: "0px 0px 0px 2px" }} onClick={() => {
              deleteItem(filteredDependencies, index)
            }}>remove</button>
          </div>
        );
      })}
      {error ? <p style={{ color: "red" }}>{error}</p> : null}
    </div>
  );
}
