class VeterinarianController {
    register = (req, res) => {
        res.send("From /api/veterinarians");
    }

    login = (req, res) => {
        res.send("From /api/veterinarians/login");
    }

    profile = (req, res) => {
        res.send("From /api/veterinarians/profile");
    }
}

export default VeterinarianController;