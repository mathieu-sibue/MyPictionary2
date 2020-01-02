const Passport = require("passport");
const PassportJwt = require("passport-jwt");
const User = require("../models/User");
const secret = require("./config");

const options = {
    jwtFromRequest: PassportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret.secret
}

const classicPassport = new Passport.Passport();
const classicStrategy = new PassportJwt.Strategy(options, async function (payload, done) {
    try {
        const user = await User.findOne({ _id: payload.userId });
        if (user) {
            return done(null, user)
        } else {
            return done(null, false)
        }
    } catch (err) {
        return done(null, false)
    }
});
classicPassport.use(classicStrategy);
exports.classicAuth = classicPassport.authenticate("jwt", { session: false });




const adminPassport = new Passport.Passport();
const adminStrategy = new PassportJwt.Strategy(options, async function (payload, done) {
    try {
        const user = await User.findOne({ _id: payload.userId });
        if (user && user.admin) {
            return done(null, user)
        } else {
            return done(null, false)
        }
    } catch (err) {
        return done(null, false)
    }
});
adminPassport.use(adminStrategy);
exports.adminAuth = adminPassport.authenticate("jwt", { session: false });