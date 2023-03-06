export default function Header() {
  return (
    <div style={{ width: "100%", height: "50px", display: "flex", alignItems: "center", borderBottom: "1px solid black"}}>
      <p style={{ flexGrow: "1"}}>Ext. Logo</p>

      <div style={{ display: "flex", gap: "20px"}}>
        <p>@username</p>
        <p>user avatar</p>
      </div>
    </div>
  );
}
