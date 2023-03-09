import App from "../models/App.js";

/* CREATE */
export const getAppData = async (req, res) => {
  try {
    const appData = await App.find();
    res.status(200).json(appData[0]);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
