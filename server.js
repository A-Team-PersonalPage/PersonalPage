const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

const GEONAME_API_URL = process.env.GEONAME_API_URL;
const GEONAME_USERNAME = process.env.GEONAME_USERNAME;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

const searchRouter = require("./routes/search");

const cityRouter = require("./routes/add/place");
const tagRouter = require("./routes/add/tag");

const placelikesRouter = require("./routes/place/placelikes");
const placesWeatherRoutes = require("./routes/place/places_weather");
const popularRouter = require("./routes/place/popular");
const placeTagsRoutes = require("./routes/place/placeTags");
const koreaRouter = require("./routes/place/koreaplace");

const favoriteplacesRouter = require("./routes/user/favoriteplaces");
const favoritetagsRouter = require("./routes/user/favoritetags");
const userRouter = require("./routes/user/users");

const commentsRoutes = require("./routes/comment/comments");

app.use("/search", searchRouter);

app.use("/place", cityRouter);
app.use("/tag", tagRouter);

app.use("/placelikes", placelikesRouter);
app.use("/places_weather", placesWeatherRoutes);
app.use("/popular", popularRouter);
app.use("/mainplace", koreaRouter);

app.use("/mypage/favoriteplaces", favoriteplacesRouter);
app.use("/mypage/favoritetags", favoritetagsRouter);
app.use("/", userRouter);

app.use("/comments", commentsRoutes);

app.use("/place_tags", placeTagsRoutes);

app.listen(process.env.PORT);