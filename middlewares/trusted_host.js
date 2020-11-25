class TrustedHost {

    trustedClient (req, res, next) {

        const knownheaders = {
            known_platform:'WEB',
            known_token:'$$$6746547gfhryg@ggfhdghgfdhgf^hfghds&'
        }
        let headerParams = {
            platform:req.headers.platform,
            source_token: req.headers.application_token
        }
    
       if(knownheaders.known_token == headerParams.source_token && knownheaders.known_platform == headerParams.platform ){
        next()
       } else {
        res.status(401).json({ status:false, message:"Untrusted client:from malicious source"})
       }
       
    }       
}

module.exports = TrustedHost