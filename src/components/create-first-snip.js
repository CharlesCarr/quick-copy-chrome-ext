import { useState } from "react";
import { supabase } from "../config/supabase-client";

const CreateFirstSnip = ({ session, setUserSnips }) => {
  const [name, setName] = useState();
  const [text, setText] = useState();
  const [category, setCategory] = useState();

  const submitHandler = async (e) => {
    e.preventDefault();

    console.log(text);

    // will add validation later - alert user
    if (!text) return;

    try {
      const { user } = session;
      const { data, error } = await supabase
        .from("snips")
        .insert({ user_id: user.id, snip_text: text, name, category })
        .select();
      console.log(data);

      // TODO: Clear Form

      // TODO: Change state for Snippets component (now have length > 0)
      setUserSnips(data);

      if (error) throw new Error(error);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <p>Brief Instructions / Description for First Time Users</p>

      <h2>Create Your First Snip</h2>

      <form
        onSubmit={submitHandler}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <label htmlFor="name">Name</label>
        <input
          name="name"
          type="text"
          placeholder="Name for Snip"
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="text">Text</label>
        <input
          name="text"
          type="text"
          placeholder="Text to be Copied"
          onChange={(e) => setText(e.target.value)}
        />

        <label htmlFor="category">Category</label>
        <input
          name="category"
          type="text"
          placeholder="Category for Your New Snip"
          onChange={(e) => setCategory(e.target.value)}
        />

        <button>Create</button>
      </form>
    </>
  );
};

export default CreateFirstSnip;
