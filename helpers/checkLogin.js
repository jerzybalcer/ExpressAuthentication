module.exports = (req, res, next) => {
    
    if(req.session.logged){ // if user is logged proceed to the requested page
      return next();
    }else { // otherwise force user to log in
      return res.redirect('/login');
    }
}