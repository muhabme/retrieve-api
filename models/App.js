import mongoose from "mongoose";

const AppSchema = new mongoose.Schema({});

const App = mongoose.model("App", AppSchema);

export default App;
