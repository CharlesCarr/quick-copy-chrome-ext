import React, { useState } from "react";
import { supabase } from "../../../react-chrome-app-ts/my-app/src/config/supabase-client";

const Snip = ({ data }) => {
  console.log(data);
  const [name, setName] = useState(null);
  const [text, setText] = useState(null);
  const [category, setCategory] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const addHandler = async () => {
    console.log(text);

    if (!text) return;

    try {
      //   const { user } = session;
      const { data: newData, error } = await supabase
        .from("snips")
        .insert({ user_id: data.id, snip_text: text, name, category })
        .select();
      console.log(newData);
      if (error) throw new Error(error);
      console.log(newData);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        columnGap: "10px",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "20px",
      }}
    >
      {/* building features for cat / name later */}
      {/* <p>{category}</p>
      <p>{name}</p> */}

      {isEdit ? (
        <input
          type="text"
          placeholder="your snippet text"
          onChange={(e) => setText(e.target.value)}
        />
      ) : (
        <p style={{ minWidth: "150px", border: "1px solid black" }}>
          {data.snip_text}
        </p>
      )}

      <button>Copy</button>
      {isEdit ? (
        <button onClick={addHandler}>Add</button>
      ) : (
        <button onClick={() => setIsEdit(true)}>Edit</button>
      )}
    </div>
  );
};

export default Snip;
