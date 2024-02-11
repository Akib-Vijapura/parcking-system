"use client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { EscPos } from "@tillpos/xml-escpos-helper";

const page = () => {
  const cmds = [
    "<ESC>!R",
    "SIZE 80 mm,21 mm",
    "CLS",
    `TEXT 10,10,"4",0,1,1,"Alto's POS & Inventory"`,
    'TEXT 10,50,"2",0,1,1,"Restaurants & Cafes"',
    'TEXT 10,75,"2",0,1,1,"Retail Stores"',
    'TEXT 10,100,"2",0,1,1,"Services"',
    'TEXT 10,125,"1",0,1,1,"https://altospos.com"',
    "PRINT 1",
    "END",
  ];

  const commands = `
    \x1B@            // Initialize printer
    \x1Bd\x01        // Set line spacing to 1/8 inch
    \x1B!\x08        // Set bold text
    Hello, World!\n   // Print bold "Hello, World!" and move to the next line
    \x1B!\x00        // Reset text to normal
    \x1B-\x01        // Set underline on
    Underlined Text\n // Print underlined text and move to the next line
    \x1B-\x00        // Reset underline
    \x1BG\x01        // Set double-strike on
    Double-Strike Text\n // Print double-strike text and move to the next line
    \x1BG\x00        // Reset double-strike
    \x1B!\x30        // Set character size to double width and height
    Large Text\n     // Print large text and move to the next line
    \x1B!\x00        // Reset character size
    \x1Dh\x20        // Set barcode height to 32 dots
    \x1Dk\x06        // Print Code 39 barcode with data "123456"
    \n               // Move to the next line
    \x1DVA           // Paper cut command
  `;

  const msg = "This is dynamic content\n";
  const barcodeData = "1234";
  // ESC/POS commands with placeholders for dynamic data
  const commands2 = `
    \x1B@            // Initialize printer
    \x1Bd\x01        // Set line spacing to 1/8 inch
    \x1B!\x08        // Set bold text
    ${msg}\n         // Print dynamic text and move to the next line
    \x1B!\x00        // Reset text to normal
    \x1Dh\x20        // Set barcode height to 32 dots
    \x1Dk\x06        // Print Code 39 barcode with data "${barcodeData}"
    \n               // Move to the next line
    \x1DVA           // Paper cut command
  `;

  // Example ASCII art (replace this with your actual ASCII art)
  const asciiArt = `                                                                                    
:::::::.*=.                                         
+********##****+=-:                                  
-++++++++**%#*******+#:           .:                   
     .::-********##*:      :-:  .:                   
::    -=+*##########%#+=:      .**+:                       
.::::..  :=*: +###%%%%%%%%##*+==--:    .=:   .......                
.::::::::.  . =#%%%%%%%%##*****+**##=    .........                  
..:::----===+###***++++****####%%%                               
:-=+*****************++**######%%%%%%%#=::::::.                        
=****+==****=-+#*#+#**+####%%%%#%%%%%#*=------:---.                      
+*+++====+++=-.:-=-=##=-*##=+*+--=**+==------:   :--.                     
#=---+:  -#+--.:---+**--=+=====--=+=----------:..---.                     
=---*.   -#*-----------*-        -#*----==-==+=-----                      
---*-   :##=--+-=*===--++:-:  :*#*+++=+-     .#+---:                      
--=#   .##=-=*=  -#-:.  :##-  *#-   .#+   :.  *#=--                       
--+*   =#:   -*   #*-:.  =#.  *-  +: #+   = :*#*---                       
--+#   +#    :#.  *  .-  .#   *. ..:*+=   : .=#+---.                      
:-=#:  .:     *. :+  -:.  #   *:  .- .+   #=   =*=--.                     
--**.   .*=    .*#==+##++*+..#*:..:=##: .*#+   .+*=-:                    
.--*#*++##*#+=+#*  *###-  +##-:*####+*####*#*.   *#=-.                   
.--=++++=-=+++#=  =--*   :#:  =###++====--=*#+-+##=-:                   
.:-----=+==+#=  =..*.  :*   **:  .*+--:.:-=+**+=--.                   
.-: :*-   +*  +--#-  :*  .*  := *#--::-----:::.                     
:---**   .#  *. -+  .*  -=  -.++*+----.                            
.----*+   = .#  .#:  *  -*   -..*#---:                             
----=#+    =#   ##- :+ :#+:.:=#*=---:                             
----=**--+##+-+#*#**#**#*****=-----:                             
.:---=+*+==+++=--======-----------                              
..:-------.  .---------:.---:                               
.----.   .--:.     ...                                 
.:--:..--.                                           
   .:::.                                             
                                                     
                                                     
-+=.+.=..--  :=:--.*: :=:  :-=::-.=-:.-- =:--:.-::=.--                    
.==-+.++:*=. :=--+:+.:+ +. :++-==:+:*:=---:=:*-=-:=.-=                    
.=: -.:: :-  :-..: --.:-:  .:-::-.+:.:=. :::.- -:.-.:-                    
                                                     
`;

  const asciiArt2 = `
##  ##  ## ##  ##  ## ##   ###   ## ## 
##  ##  ## ##  ##  ## ##   ## ##  ## ## 
##  ##  ## ##  ##  ## ##    ###   ## ## 
##  ##  ## ##  ##  ## ##    ###   ## ## 
##  ##  ## ##  ##  ## ##   ## ##  ## ## 
 ###    ## ##  ##  ## ##   ###   ## ## 
`;

  // Send ESC/POS commands to the thermal printer with ASCII art
  const commandsForACSII = `
      \x1B@            // Initialize printer
      \x1Bd\x01        // Set line spacing to 1/8 inch
      \x1B!\x21\x00    // Set font size to 2x2
      ${asciiArt2}\n    // Print ASCII art and move to the next line
      \x1B!\x00        // Reset font size to default
      \x1DVA           // Paper cut command
    `;
  // store this template somewhere `s3` or as `static asset` based on your preference
  const templateText = `
  <?xml version="1.0" encoding="UTF-8"?>
  <document>
    <align mode="center">
      <bold>
        <text-line size="1:0">{{title}}</text-line>
      </bold>
    </align>

    
    <align mode="center">
      <text-line size="0:0">  {{{thankyouNote}}}</text-line>
    </align>

    <line-feed />

    <paper-cut />
  </document>
`;

  const inputText = {
    title: "Sample",
    thankyouNote: "Welcome...!",
  };

  const templateWater = `
  <?xml version="1.0" encoding="UTF-8"?>
  <document>
    <align mode="center">
      <bold>
        <text-line size="1:0">{{title}}</text-line>
      </bold>
    </align>

    
    <align mode="center">
      <text-line size="0:0">  {{address}}</text-line>
    </align>

    <align mode="center">
      <text-line size="2:0">  {{vType}}</text-line>
    </align>

    <align mode="center">
      <text-line size="0:0">  {{dateAndTime}}</text-line>
    </align>

    <align mode="center">
      <text-line size="0:0">  {{amount}}</text-line>
    </align>


    <line-feed />

    <paper-cut />
  </document>
`;

  const inputWater = {
    title: "Water Ville",
    address: "Himmatnagar, Gujarat, 383001",
    vType: "CAR",
    dateAndTime: "7 Feb 2024   2:22 PM",
    amount: "Rs 100",
  };

  const templatePng = `<?xml version="1.0" encoding="UTF-8"?>
<document>
  <align mode="center">
    <bold>
      <text-line size="1:0">{{title}}</text-line>
    </bold>
      
    <image density="d24">
      {{base64PngImage}}
    </image>
  </align>    
</document>`;

  const inputPng = {
    title: "PNG - base64",
    base64PngImage: `data:image/png;base64,iVBORw0KGgoAAA+P/AaNn2GPEMgEFAAAAAElFTkSuQmCC`,
  };

  const templateData = {
    orderDate: "Oct 27, 2022, 12:00",
    userName: "Tahsin Ahmed Khan",
    providerName: "Test",
    shortId: `#TS-1234`,
    //qrCode,
    //qrCodeLabel,
    brandTemplateTable: "water ville",
    cartTemplateTable: "213 123",
    pricesTemplateTable: "111 111",
    totalTemplateTable: "222 222",
    //logo: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAQAAAC0NkA6AAA223pUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjapZ1pkiY3zqT`
  };

  const cartXmlTemplate = (qrCodeContent, qrCodeLabel) => `
<?xml version="1.0" encoding="UTF-8"?>
<document>
  <text-line>Order Date: {{orderDate}}</text-line>
  <line-feed />
  <text-line size="1:1">{{userName}}</text-line>
  <line-feed />
  <text-line size="1:1">{{providerName}} {{shortId}}</text-line>
  <line-feed />
  <text-line>{{brandTemplateTable}}</text-line>
  <line-feed />
  <bold>
    <text-line>{{cartTemplateTable}}</text-line>
  </bold>
  <text-line>{{pricesTemplateTable}}</text-line>
  <bold>
    <text-line>{{totalTemplateTable}}</text-line>
  </bold>
  <line-feed />
  ${
    qrCodeLabel
      ? `<align mode="center"> <text-line> {{qrCodeLabel}} </text-line></align> <line-feed />`
      : ``
  }
  ${
    qrCodeContent
      ? `<align mode="center">
      <image density="d24">
      {{qrCode}}
    </image>
    </align>
  <line-feed />`
      : `<line-feed />`
  }
  <align mode="center">
    <small>
      <text-line>Powered by</text-line>
    </small>
    
    <small>
      <text-line>Company name</text-line>
    </small>
  </align>
  <line-feed />
  <paper-cut/>
</document>`;

  const [port, setPort] = useState();
  const qrCodeContent = "21312321312";
  const qrCodeLabel = "qrcodelabel";

  async function transferOutTest(device) {
    /*const buffer = EscPos.getBufferFromTemplate(
                  cartXmlTemplate(qrCodeContent, qrCodeLabel),
                  templateData,
                );*/
    const buffer = EscPos.getBufferFromTemplate(templateWater, inputWater);

    // send this buffer to a stream (eg.: bluetooth or wifi)
    await device.open();
    await device.selectConfiguration(1);
    await device.claimInterface(0);
    await device.transferOut(
      device.configuration.interfaces[0].alternate.endpoints.find(
        (obj) => obj.direction === "out"
      ).endpointNumber,
      //new Uint8Array(
      //    new TextEncoder().encode(cmds.join('\r\n'))
      //new TextEncoder().encode(escPosCommands)
      //    commands
      //),
      //new TextEncoder().encode(commandsForACSII)
      buffer
    );

    await device.close();
  }

  const { mutateAsync: print, isLoading: isPrinting } = useMutation({
    mutationFn: async () => {
      let _port = port;
      //const data = await navigator.usb.getDevices();
      console.log("mutataion usb");
      try {
        const device = await navigator.usb.requestDevice({
          filters: [{ vendorId: 4070 }],
        });
        console.log("devices=", device);
        await transferOutTest(device);
      } catch (e) {
        console.error("error=", e);
      }
      /*if (_port == null) {
      _port = await navigator.usb.getDevices();
      await _port.open({ baudRate: 9600 });
      setPort(_port);
      console.log("setPort is =", port)
    }

    const writer = _port.writable?.getWriter();
    if (writer != null) {
      const data = await render(receipt);

      await writer.write(data);
      writer.releaseLock();
    }*/
    },
  });

  const receipt = <></>;

  return (
    <main>
      <div>{receipt}</div>
      <div style={{ marginTop: 24 }}>
        <button disabled={isPrinting} onClick={() => print()}>
          {isPrinting ? "Printing..." : "Print"}
        </button>
      </div>
    </main>
  );
};

export default page;
