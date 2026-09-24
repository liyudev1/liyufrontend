import { 
    Box, 
    Button, 
    CircularProgress, 
    TextField, 
    Typography, 
    Avatar,
    Stack,
    Paper,
    Container,
    IconButton,
    useTheme,
    useMediaQuery
  } from "@mui/material";
  import { 
    PersonOutlined, 
    PhoneOutlined, 
    Telegram,
    Facebook,
    YouTube,
    Instagram,
    LinkedIn,
    Send,
  } from "@mui/icons-material";
  import { Header } from "./HomePage";
  import BottomNav from "./BottomNav";
  import { useState } from "react";
  import api from "../api";

  
  function ContactUs() {
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
 
    const handleClick = (url) => {
      const newWindow = window.open(url, "_blank", "noopener,noreferrer");
      
      if (newWindow) {
        newWindow.focus();
      }
    };
    async function handleSubmit() {
      setLoading(true);
      try {
        await api.post("contact-us/", {
          name: name,
          contact: contact,
          message: message
        });

      } catch (error) {
        console.log("error while submitting message");
      } finally {
        setName("");
        setContact("");
        setMessage("");
        setLoading(false);
      }
    }
  
    const socialLinks = [
      { icon: <Facebook />, color: "#1877F2",link:"" },
      { icon: <YouTube />, color: "#FF0000",link:"" },
      { icon: <Instagram />, color: "#E4405F",link:"" },
      { icon: <Telegram />, color: "#0088CC",link:"https://t.me/crusade_12" },
      { icon: <LinkedIn />, color: "#0A66C2" },
    ];
  
    const contactPersons = [
      {
        name: "Hailemariam",
        role: "Manager",
        phone: "0956769920   0777454599",
        color: "warning",
      },
      {
        name: "Haile Abi",
        role: "Developer",
        phone: "0949016815",
        color: "success",
      },
    ];
  
    return (
      <Box
        sx={{
          minHeight: '100dvh',
          width: '100%',
          backgroundColor: '#F9F9F9',
          position: "relative",
          display: "flex",
          flexDirection: "column",
          pb: 8,
        }}
      >
        <Header />
        <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              textAlign: 'center',
              mt: 6,
              mb:5,
              color: 'primary.main',
            }}
          >
            Contact Us
          </Typography>
  
          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              borderRadius: 3,
              overflow: 'hidden',
              mb: 4,
              gap:3
            }}
          >
            <Box
              sx={{
                flex: 1,
                backgroundColor:"#F9F9F9",
                py: 4,
                px:2,
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
              }}
            >
  
              <Stack spacing={5}>
                {contactPersons.map((person, index) => (
                  <Box key={index}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar
                            sx={{
                                width: 100,
                                height: 100,
                                bgcolor: 'primary.main',
                                fontSize: '1.5rem',
                            }}
                            >
                            H
                            </Avatar>
                            <Box>
                            <Typography variant="h6" fontWeight={600}>
                                {person.name}
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <PhoneOutlined color={person.color} />
                                <Typography variant="body2" color="text.secondary">
                                    {person.phone}
                                </Typography>
                            </Stack>
                            <Typography>{person.role}</Typography>
                            </Box>
                        </Stack>
                  </Box>
                ))}
              </Stack>
  

              <Box>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Contact Developer
                </Typography>
                <Stack direction="row" spacing={1}>
                  {socialLinks.map((social, index) => (
                    <IconButton
                      key={index}
                      onClick={()=>handleClick(social.link)}
                      sx={{
                        backgroundColor: `${social.color}15`,
                        color: social.color,
                        '&:hover': {
                          backgroundColor: `${social.color}25`,
                        },
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  ))}
                </Stack>
              </Box>
  
              <Button
                variant="contained"
                startIcon={<Telegram />}
                fullWidth
                sx={{
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                Join Telegram Channel
              </Button>
            </Box>
  
            <Box
              sx={{
                flex: 1,
                py: 4,
                px:2,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Send us a Message
              </Typography>
              
              <TextField
                fullWidth
                label="Your Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              
              <TextField
                fullWidth
                label="Your Contact"
                variant="outlined"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
              
              <TextField
                fullWidth
                label="Your Message"
                variant="outlined"
                multiline
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                onClick={handleSubmit}
                disabled={loading}
                sx={{
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  py: 1.5,
                  borderRadius: 2,
                  mt: 1,
                }}
              >
                {loading ? 'Submitting...' : 'Submit Message'}
              </Button>
            </Box>
          </Box>
        </Container>
        
        <BottomNav />
      </Box>
    );
  }
  
  export default ContactUs;