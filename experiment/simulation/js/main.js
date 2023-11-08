function openPart(evt, name) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(name).style.display = "block";
    evt.currentTarget.className += " active";
}

var k;
var p;
var sigChoice;
var scaleChoice;
var delayChoice;
var boxChoice;
var yValues;
var inValues;

// ------------------------------------------- Slider --------------------------------------------------------------------

var slider = document.getElementById("myRange");

slider.oninput = function() {
  fourier(this.value);
}
/*
var slider1 = document.getElementById("myRange1");

slider1.oninput = function() {
  canvasFourier(this.value);
}
*/

// ---------------------------------------------------- DFT -----------------------------------------------------------------

function calculateDFT(data) {
    const N = data.length;
    const dft = [];
  
    for (let k = 0; k < N; k++) {
      let real = 0;
      let imag = 0;
      
      for (let n = 0; n < N; n++) {
        const angle = (2 * Math.PI * k * n) / N;
        real += data[n] * Math.cos(angle);
        imag -= data[n] * Math.sin(angle);
      }
  
      real /= N;
      imag /= N;
  
      dft.push({ frequency: k, amplitude: Math.sqrt(real * real + imag * imag) });
    }
  
    return dft;
}

// ---------------------------------------------------- Calculate fourier series coefficients -------------------------------------

function calculateFourierCoefficients(data, T, kMax) {
    
    const coefficients = [];
  
    for (let n = 1; n <= kMax; n++) {
      let a_n = 0;
      let b_n = 0;
  
      for (let t = 0; t < T; t += T / data.length) {
        const omega = (2 * Math.PI * n) / T;
        a_n += (2 / T) * data[t * data.length] * Math.cos(omega * t);
        b_n += (2 / T) * data[t * data.length] * Math.sin(omega * t);
      }
  
      coefficients.push({ n, a: a_n, b: b_n });
    }
  
    return coefficients;
}

// ------------------------------------------ slider fourier  ----------------------------------------------------------

function square(numCoeff)
{
    var num = parseInt(numCoeff);
    N = 1000;
    f = 1;
    w0 = 2*Math.PI*f;

    var xValues = makeArr(0,1,N);
    var sigValues = makeArr(0,0,N);
    
    for(var k=1; k<=num; k++)
    {
        for(var i=0; i<N; i++)
        {
            if(k%2 == 1)
            {
                sigValues[i] = sigValues[i] + (4/(Math.PI*k))*Math.sin(k*w0*xValues[i]);
            }
        }
    }

    var boxSignal = [];
    for(var i=0; i<N; i++)
    {
        if(i<N/2)
        {
            boxSignal.push(1);
        }
        else
        {
            boxSignal.push(-1);
        }
    }
    
    var trace1 = {
        x: xValues,
        y: sigValues,
        type: 'scatter',
        name: 'Reconstructed',
        mode: 'lines'
    };

    var trace2 = {
        x: xValues,
        y: boxSignal,
        type: 'scatter',
        name: 'Original',
        mode: 'lines'
    };
      
    var data1 = [trace1,trace2];

    var config = {responsive: true}
    
    if(screen.width < 769)
    {
        var update = {
            width: 0.8*screen.width,
            height: 400
        };
        var layout1 = {
            title: 'Reconstruction',
            showlegend: false,
            xaxis: {
                title: 'Time (s)'
            },
            yaxis: {
                title: 'Magnitude'
            }
        };
    }
    else if(screen.width > 1600)
    {
        var update = {
            width: 0.55*screen.width,
            height: 400
        };
        var layout1 = {
            title: 'Reconstruction',
            showlegend: true,
            xaxis: {
                title: 'Time (s)'
            },
            yaxis: {
                title: 'Magnitude'
            }
        };
    }
    else
    {
        var update = {
            width: 500,
            height: 500
        };
        var layout1 = {
            title: 'Reconstruction',
            showlegend: true,
            xaxis: {
                title: 'Time (s)'
            },
            yaxis: {
                title: 'Magnitude'
            }
        };
    }

    Plotly.newPlot('figure1', data1, layout1, config);

    Plotly.relayout('figure1', update);
}

// ------------------------------------------ Canvas reconstruction ------------------------------------------------------------------

/*
const canvas = document.getElementById("canvas");
        const context = canvas.getContext("2d");
        const storeButton = document.getElementById("storeButton");

        var signalData = []; // Array to store the drawn signal
        var xData = [];
        var yData = [];
        var fund = 10;

        let isDrawing = false;

        canvas.addEventListener("mousedown", () => {
            isDrawing = true;
        });

        canvas.addEventListener("mousemove", (e) => {
            if (!isDrawing) return;

            const x = e.offsetX;
            const y = e.offsetY;

            // Draw on the canvas (you can customize the drawing style)
            context.lineWidth = 2;
            context.lineCap = "round";
            context.strokeStyle = "black";
            context.lineTo(x, y);
            context.stroke();

            // Store the point in the signalData array
            signalData.push({ x, y });
        });

        canvas.addEventListener("mouseup", () => {
            isDrawing = false;
            context.closePath();
        });

        clearButton.addEventListener("click", () =>{
            context.clearRect(0, 0, canvas.width, canvas.height);
            signalData = [];
        });

        storeButton.addEventListener("click", () => {
            xData = signalData.map(point => point.x);
            yData = signalData.map(point => point.y);
            lockCanvas();
        });

function lockCanvas() {
    
    N = signalData.length;

    const dftResult = calculateDFT(yData);
    // Find the index of the maximum amplitude (fundamental frequency)
    let fundamentalFrequencyIndex = 0;
    let maxAmplitude = 0;

    for (let i = 1; i < dftResult.length; i++) {
        if (dftResult[i].amplitude > maxAmplitude) {
            maxAmplitude = dftResult[i].amplitude;
            fundamentalFrequencyIndex = i;
        }
    }

    // Calculate the fundamental frequency in Hertz
    const sampleRate = 44100; // Replace with your actual sample rate
    fund = (fundamentalFrequencyIndex / signalData.length) * sampleRate;
}
*/

function canvasFourier(numCoeff){

    var num = parseInt(numCoeff);

    w0 = 2*Math.PI*fund;

    T = 1/fund;

    var xValues = xData;
    var sigValues = makeArr(0,0,xValues.length);

    coefficients = calculateFourierCoefficients(yData, T, num);
    var a_n = coefficients.a;
    var b_n = coefficients.b;

    console.log(coefficients)
    /*
    for(var k=1; k<=num; k++)
    {
        for(var i=0; i<xData.length; i++)
        {
            sigValues[i] = sigValues[i] + a_n[i]*Math.cos(k*w0*xValues[i]) + b_n[i]*Math.sin(k*w0*xValues[i]);
        }
    }*/
    
    var trace1 = {
        x: xValues,
        y: sigValues,
        type: 'scatter',
        name: 'Reconstructed',
        mode: 'lines'
    };

    var trace2 = {
        x: xValues,
        y: yData,
        type: 'scatter',
        name: 'Original',
        mode: 'lines'
    };
      
    var data1 = [trace1,trace2];

    var config = {responsive: true}
    
    if(screen.width < 769)
    {
        var update = {
            width: 0.8*screen.width,
            height: 400
        };
        var layout1 = {
            title: 'Reconstruction',
            showlegend: false,
            xaxis: {
                title: 'Time (s)'
            },
            yaxis: {
                title: 'Magnitude'
            }
        };
    }
    else if(screen.width > 1600)
    {
        var update = {
            width: 0.55*screen.width,
            height: 400
        };
        var layout1 = {
            title: 'Reconstruction',
            showlegend: true,
            xaxis: {
                title: 'Time (s)'
            },
            yaxis: {
                title: 'Magnitude'
            }
        };
    }
    else
    {
        var update = {
            width: 500,
            height: 500
        };
        var layout1 = {
            title: 'Reconstruction',
            showlegend: true,
            xaxis: {
                title: 'Time (s)'
            },
            yaxis: {
                title: 'Magnitude'
            }
        };
    }

    Plotly.newPlot('figure2', data1, layout1, config);

    Plotly.relayout('figure2', update);
}

// ------------------------------------------ Fourier Series of known signals ----------------------------------------------------------

function fourier(numCoeff)
{
    var chosen = document.getElementById("dropDownFourier").value;
    var choice = parseInt(chosen);

    if(choice==1)
    {
        square(numCoeff);
    }
    else if(choice==2)
    {
        triangle(numCoeff);
    }
    else
    {
        custom(numCoeff);
    }
}

function square(numCoeff)
{
    var num = parseInt(numCoeff);
    N = 1000;
    f = 1;
    w0 = 2*Math.PI*f;

    var xValues = makeArr(0,1,N);
    var sigValues = makeArr(0,0,N);
    
    for(var k=1; k<=num; k++)
    {
        for(var i=0; i<N; i++)
        {
            if(k%2 == 1)
            {
                sigValues[i] = sigValues[i] + (4/(Math.PI*k))*Math.sin(k*w0*xValues[i]);
            }
        }
    }

    var boxSignal = [];
    for(var i=0; i<N; i++)
    {
        if(i<N/2)
        {
            boxSignal.push(1);
        }
        else
        {
            boxSignal.push(-1);
        }
    }
    
    var trace1 = {
        x: xValues,
        y: sigValues,
        type: 'scatter',
        name: 'Reconstructed',
        mode: 'lines'
    };

    var trace2 = {
        x: xValues,
        y: boxSignal,
        type: 'scatter',
        name: 'Original',
        mode: 'lines'
    };
      
    var data1 = [trace1,trace2];

    var config = {responsive: true}
    
    if(screen.width < 769)
    {
        var update = {
            width: 0.8*screen.width,
            height: 400
        };
        var layout1 = {
            title: 'Reconstruction',
            showlegend: false,
            xaxis: {
                title: 'Time (s)'
            },
            yaxis: {
                title: 'Magnitude'
            }
        };
    }
    else if(screen.width > 1600)
    {
        var update = {
            width: 0.55*screen.width,
            height: 400
        };
        var layout1 = {
            title: 'Reconstruction',
            showlegend: true,
            xaxis: {
                title: 'Time (s)'
            },
            yaxis: {
                title: 'Magnitude'
            }
        };
    }
    else
    {
        var update = {
            width: 500,
            height: 500
        };
        var layout1 = {
            title: 'Reconstruction',
            showlegend: true,
            xaxis: {
                title: 'Time (s)'
            },
            yaxis: {
                title: 'Magnitude'
            }
        };
    }

    Plotly.newPlot('figure1', data1, layout1, config);

    Plotly.relayout('figure1', update);
}

function triangle(numCoeff)
{
    var num = parseInt(numCoeff);
    N = 1000;
    f = 1/2;
    w0 = 2*Math.PI*f;

    var xValues = makeArr(0,2,N);
    var sigValues = makeArr(0,0,N);
    
    for(var k=1; k<=num; k++)
    {
        for(var i=0; i<N; i++)
        {
            if(k%2 == 1)
            {
                var val = parseInt((k-1)/2);
                if(val%2 == 1)
                {
                    sigValues[i] = sigValues[i] - (8/(Math.PI*Math.PI*k*k))*Math.sin(k*w0*xValues[i]);
                }
                else
                {
                    sigValues[i] = sigValues[i] + (8/(Math.PI*Math.PI*k*k))*Math.sin(k*w0*xValues[i]);
                }
            }
        }
    }

    var triangleSignal = [];
    for(var i=0; i<N; i++)
    {
        if(i<N/4)
        {
            triangleSignal.push(2*xValues[i]);
        }
        else if(i<(3*N/4))
        {
            triangleSignal.push(2*(1-xValues[i]));
        }
        else
        {
            triangleSignal.push(2*(xValues[i]-2));
        }
    }
    
    var trace1 = {
        x: xValues,
        y: sigValues,
        type: 'scatter',
        name: 'Reconstructed',
        mode: 'lines'
    };

    var trace2 = {
        x: xValues,
        y: triangleSignal,
        type: 'scatter',
        name: 'Original',
        mode: 'lines'
    };
      
    var data1 = [trace1,trace2];

    var config = {responsive: true}
    
    if(screen.width < 769)
    {
        var update = {
            width: 0.8*screen.width,
            height: 400
        };
        var layout1 = {
            title: 'Reconstruction',
            showlegend: false,
            xaxis: {
                title: 'Time (s)'
            },
            yaxis: {
                title: 'Magnitude'
            }
        };
    }
    else if(screen.width > 1600)
    {
        var update = {
            width: 0.55*screen.width,
            height: 400
        };
        var layout1 = {
            title: 'Reconstruction',
            showlegend: true,
            xaxis: {
                title: 'Time (s)'
            },
            yaxis: {
                title: 'Magnitude'
            }
        };
    }
    else
    {
        var update = {
            width: 500,
            height: 500
        };
        var layout1 = {
            title: 'Reconstruction',
            showlegend: true,
            xaxis: {
                title: 'Time (s)'
            },
            yaxis: {
                title: 'Magnitude'
            }
        };
    }

    Plotly.newPlot('figure1', data1, layout1, config);

    Plotly.relayout('figure1', update);
}

function custom(numCoeff)
{
    var num = parseInt(numCoeff);
    N = 1000;
    f = 1/(4*Math.PI);
    w0 = 2*Math.PI*f;

    var xValues = makeArr(0,4*Math.PI,N);
    var sigValues = makeArr(0,0,N);
    
    for(var k=1; k<=num; k++)
    {
        for(var i=0; i<N; i++)
        {
            if(k%2==1)
            {
                var value = (1/(4*Math.PI))*((((Math.sin(k*w0*Math.PI))/(1-k*w0))+((Math.sin(k*w0*Math.PI))/(1+k*w0))) + 2*((Math.cos(Math.PI*k*w0)-Math.cos(2*Math.PI*k*w0))/(k*w0)) + 2*((Math.cos(3*Math.PI*k*w0)-Math.cos(2*Math.PI*k*w0))/(k*w0)) - (((Math.sin(4*Math.PI*k*w0)+Math.sin(3*Math.PI*k*w0))/(1-k*w0)) + ((Math.sin(4*Math.PI*k*w0)+Math.sin(3*Math.PI*k*w0))/(1+k*w0))));
                sigValues[i] = sigValues[i] + value*Math.sin(k*w0*xValues[i]);
            }
                //console.log(sigValues[i]);
        }
    }

    var mySignal = [];
    for(var i=0; i<N; i++)
    {
        if(i<N/2)
        {
            mySignal.push((1+Math.abs(Math.sin(xValues[i])))/2);
        }
        else
        {
            mySignal.push(-(1+Math.abs(Math.sin(xValues[i])))/2);
        }
    }
    
    var trace1 = {
        x: xValues,
        y: sigValues,
        type: 'scatter',
        name: 'Reconstructed',
        mode: 'lines'
    };

    var trace2 = {
        x: xValues,
        y: mySignal,
        type: 'scatter',
        name: 'Original',
        mode: 'lines'
    };
      
    var data1 = [trace1,trace2];

    var config = {responsive: true}
    
    if(screen.width < 769)
    {
        var update = {
            width: 0.8*screen.width,
            height: 400
        };
        var layout1 = {
            title: 'Reconstruction',
            showlegend: false,
            xaxis: {
                title: 'Time (s)'
            },
            yaxis: {
                title: 'Magnitude'
            }
        };
    }
    else if(screen.width > 1600)
    {
        var update = {
            width: 0.55*screen.width,
            height: 400
        };
        var layout1 = {
            title: 'Reconstruction',
            showlegend: true,
            xaxis: {
                title: 'Time (s)'
            },
            yaxis: {
                title: 'Magnitude'
            }
        };
    }
    else
    {
        var update = {
            width: 500,
            height: 500
        };
        var layout1 = {
            title: 'Reconstruction',
            showlegend: true,
            xaxis: {
                title: 'Time (s)'
            },
            yaxis: {
                title: 'Magnitude'
            }
        };
    }

    Plotly.newPlot('figure1', data1, layout1, config);

    Plotly.relayout('figure1', update);
}

// ------------------------------------------------ Quasi - Periodic -----------------------------------------------------------

const kanvas = document.getElementById("kanvass");
const ctx = kanvas.getContext("2d");

function quasi()
{
    var chosen = document.getElementById("dropDownFourier1").value;
    var choice = parseInt(chosen);

    if(choice==1)
    {
        const ecgData = generateECGSignal();

      // Set up canvas drawing parameters
      const canvasWidth = kanvas.width;
      const canvasHeight = kanvas.height;
      const signalAmplitude = canvasHeight / 4;
      const signalOffset = canvasHeight / 2;

      // Draw the ECG-like signal on the canvas
      ctx.beginPath();
      ctx.moveTo(0, ecgData[0] * signalAmplitude + signalOffset);

      for (let i = 1; i < ecgData.length; i++) {
        ctx.lineTo((i / ecgData.length) * canvasWidth, ecgData[i] * signalAmplitude + signalOffset);
      }

      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    else if(choice==2)
    {
        setInterval(updatePendulum, 10);
    }
    else
    {
        const duration = 5; // Duration of the signal in seconds
      const sampleRate = 8000; // Samples per second
      const numSamples = duration * sampleRate;

      const frequencyStart = 1; // Initial frequency in Hz
      const frequencyEnd = 15; // Final frequency in Hz

      // Create a time array
      const time = Array.from({ length: numSamples }, (_, i) => i / sampleRate);

      // Create a linear chirp signal
      const chirpData = time.map((t) => {
        const frequency = frequencyStart + ((frequencyEnd - frequencyStart) * t) / duration;
        return Math.sin(2 * Math.PI * frequency * t);
      });

      // Set up canvas drawing parameters
      const canvasWidth = kanvas.width;
      const canvasHeight = kanvas.height;

      // Draw the linear chirp signal on the canvas
      ctx.beginPath();
      ctx.moveTo(0, (1 - chirpData[0]) * canvasHeight * 0.5);

      for (let i = 1; i < chirpData.length; i++) {
        ctx.lineTo((i / chirpData.length) * canvasWidth, (1 - chirpData[i]) * canvasHeight * 0.5);
      }

      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
}

function generateECGSignal() {
    const data = [];
    const heartRate = 60; // Heart rate in beats per minute
    const duration = 10; // Duration of the signal in seconds
    const sampleRate = 1000; // Samples per second
    const numSamples = duration * sampleRate;

    // Create a time array
    const time = Array.from({ length: numSamples }, (_, i) => i / sampleRate);

    // Generate a simplified ECG-like signal
    for (let t of time) {
      // Create a P wave
      const pWave = 0.1 * Math.sin(2 * Math.PI * (1 / 0.6) * t);

      // Create a QRS complex
      const qrsComplex =
        0.3 * Math.sin(2 * Math.PI * (1 / 0.4) * t) +
        0.5 * Math.sin(2 * Math.PI * (1 / 0.1) * t);

      // Create a T wave
      const tWave = 0.2 * Math.sin(2 * Math.PI * (1 / 0.7) * t);

      // Combine the waveforms
      const signal = pWave + qrsComplex + tWave;

      data.push(signal);
    }

    return data;
}

        const g = 9.81; // Acceleration due to gravity
        const length1 = 100; // Length of the first pendulum arm
        const length2 = 100; // Length of the second pendulum arm
        let theta1 = Math.PI / 4; // Initial angle of the first pendulum
        let theta2 = Math.PI / 8; // Initial angle of the second pendulum
        let omega1 = 0; // Initial angular velocity of the first pendulum
        let omega2 = 0; // Initial angular velocity of the second pendulum

        const timeStep = 0.05; // Time step for simulation
        const traceLength = 100; // Number of points to trace the motion

        const trace1 = [];
        const trace2 = [];

        function drawPendulum(x1, y1, x2, y2) {
            ctx.clearRect(0, 0, kanvas.width, kanvas.height);
            ctx.beginPath();
            ctx.moveTo(kanvas.width / 2, kanvas.height / 2);
            ctx.lineTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            // Draw trace
            trace1.push({ x: x1, y: y1 });
            trace2.push({ x: x2, y: y2 });
            if (trace1.length > traceLength) {
                trace1.shift();
                trace2.shift();
            }
            ctx.strokeStyle = "blue";
            for (let i = 1; i < trace1.length; i++) {
                ctx.beginPath();
                ctx.moveTo(trace1[i - 1].x, trace1[i - 1].y);
                ctx.lineTo(trace1[i].x, trace1[i].y);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(trace2[i - 1].x, trace2[i - 1].y);
                ctx.lineTo(trace2[i].x, trace2[i].y);
                ctx.stroke();
            }
        }

        function updatePendulum() {
            // Equations of motion for double pendulum
            const deltaTheta1 = omega1;
            const deltaTheta2 = omega2;
            const denom1 = (length1 * 2 / 3) * (1 + 2 * Math.sin(theta1 - theta2) ** 2);
            const denom2 = (length2 * 2 / 3) * (1 + 2 * Math.sin(theta1 - theta2) ** 2);
            const deltaOmega1 = (g * (Math.sin(theta2) * Math.cos(theta1 - theta2) - Math.sin(theta1)) - omega2 ** 2 * length2 * Math.sin(theta1 - theta2) - omega1 ** 2 * length1 * Math.sin(theta1 - theta2) * Math.cos(theta1 - theta2)) / denom1;
            const deltaOmega2 = (g * (2 * Math.sin(theta1 - theta2) * Math.cos(theta1 - theta2) - Math.sin(theta2)) + omega1 ** 2 * length1 * (Math.sin(theta1 - theta2) * Math.cos(theta1 - theta2) - Math.sin(theta1)) + omega2 ** 2 * length2 * Math.sin(theta1 - theta2)) / denom2;
            theta1 += deltaTheta1 * timeStep;
            theta2 += deltaTheta2 * timeStep;
            omega1 += deltaOmega1 * timeStep;
            omega2 += deltaOmega2 * timeStep;

            const x1 = kanvas.width / 2 + length1 * Math.sin(theta1);
            const y1 = kanvas.height / 2 + length1 * Math.cos(theta1);
            const x2 = x1 + length2 * Math.sin(theta2);
            const y2 = y1 + length2 * Math.cos(theta2);

            drawPendulum(x1, y1, x2, y2);
        }

/*
function fourier(waveform){
    var N = waveform.length;
    var ft = [];
    
    for(var k=0; k<N; k++)
    {
        var sum = math.complex(0,0);
        for(var n=0; n<N; n++)
        {
            sum = math.add(sum,(math.multiply(waveform[n],math.complex(Math.cos(2*Math.PI*k*n/N),-Math.sin(2*Math.PI*k*n/N)))));
        }
        if(math.re(sum)<1e-10)
        {
            var sum1 = math.complex(0,math.im(sum));
            sum = sum1;
        }
        if(math.im(sum)<1e-10)
        {
            var sum1 = math.complex(math.re(sum),0);
            sum = sum1;
        }
        ft.push(sum);
    }
    return ft;
}

function invFourier(waveform){
    var N = waveform.length;
    var ft = [];
    
    for(var k=0; k<N; k++)
    {
        var sum = math.complex(0,0);
        for(var n=0; n<N; n++)
        {
            sum = math.add(sum,math.complex(math.re(waveform[n])*Math.cos(2*Math.PI*k*n/N)/N - math.im(waveform[n])*Math.sin(2*Math.PI*k*n/N)/N,math.re(waveform[n])*Math.sin(2*Math.PI*k*n/N)/N + math.im(waveform[n])*Math.cos(2*Math.PI*k*n/N)/N));
        }
        if(math.re(sum)<1e-10)
        {
            var sum1 = math.complex(0,math.im(sum));
            sum = sum1;
        }
        if(math.im(sum)<1e-10)
        {
            var sum1 = math.complex(math.re(sum),0);
            sum = sum1;
        }
        ft.push(sum);
    }
    return ft;
}
*/

function shift(signal){
    var N = signal.length;
    var cut = parseInt(N/2);
    var out = [];
    for(var i=cut+1; i<N; i++)
    {
        out.push(signal[i]);
    }
    for(var i=0; i<=cut; i++)
    {
        out.push(signal[i]);
    }
    return out;
}

function syst(){
    var sel = document.getElementById("imp-names2").value;
    sel = parseFloat(sel);
    var sel1 = document.getElementById("sig-names2").value;
    sel1 = parseFloat(sel1);
    var lc = document.getElementById("cutoff1").value;
    lc = parseFloat(lc);
    var hc = document.getElementById("cutoff2").value;
    hc = parseFloat(hc);
    am = 1;
    freq = 0.3;
    var sigValues = [];
    var sigValues1 = [];
    var yValues = [];

    if(sel==1)
    {
        var xValues = makeArr(-100,100,201);
        for (var i=0; i<=200; i++)
        {
            sigValues.push(am*Math.sin(freq*xValues[i]));
        }
    }
    else if(sel==2)
    {
        var xValues = makeArr(-100,100,201);
        for (var i=0; i<=200; i++)
        {
            sigValues.push(am*Math.cos(freq*xValues[i]));
        }
    }
    else if(sel==3)
    {
        var total = 201;
        var xValues = makeArr(-parseInt((total-1)/2),parseInt((total-1)/2),total);
        for (var i=0; i<=total-1; i++)
        {
            var c = parseInt(total/3);
            if(i<c)
            {
                sigValues.push(0);
            }
            else if(i<2*c)
            {
                sigValues.push(am*xValues[i]);
            }
            else
            {
                sigValues.push(0);
            }
        }
    }
    else
    {
        var total = 201;
        var xValues = makeArr(-parseInt((total-1)/2),parseInt((total-1)/2),total);
        for (var i=0; i<=total-1; i++)
        {
            var c = parseInt(total/3);
            if(i<c)
            {
                sigValues.push(0);
            }
            else if(i<2*c)
            {
                sigValues.push(am);
            }
            else
            {
                sigValues.push(0);
            }
        }
    }

    var transOr = fourier(sigValues);
    var trans = shift(transOr);
    var wValues = [];
    var N = sigValues.length;
    var ampSpec = [];
    var phSpec = [];
    wValues = makeArr(-Math.PI,Math.PI,N);
    for(var i=0; i<N; i++)
    {
        ampSpec.push(math.sqrt(math.pow(math.re(trans[i]),2)+math.pow(math.im(trans[i]),2)));
        phSpec.push(math.atan2(math.im(trans[i]),math.re(trans[i])));
    }

    var filValues = [];
    var filValues1 = [];
    if(sel1==2)
    {
        for (var i=0; i<=200; i++)
        {
            if(Math.abs(wValues[i])<lc*Math.PI)
            {
                filValues.push(1);
            }
            else
            {
                filValues.push(0);
            }
        }
    }
    else if(sel1==1)
    {
        for (var i=0; i<=200; i++)
        {
            if(Math.abs(wValues[i])<lc*Math.PI)
            {
                filValues.push(0);
            }
            else
            {
                filValues.push(1);
            }
        }
    }
    else if(sel1==3)
    {
        if(lc>hc)
        {
            var temp = hc;
            hc = lc;
            lc = temp;
        }
        for (var i=0; i<=200; i++)
        {
            if(Math.abs(wValues[i])>lc*Math.PI && Math.abs(wValues[i])<hc*Math.PI)
            {
                filValues.push(1);
            }
            else
            {
                filValues.push(0);
            }
        }
    }
    else
    {
        if(lc>hc)
        {
            var temp = hc;
            hc = lc;
            lc = temp;
        }
        for (var i=0; i<=1000; i++)
        {
            if(Math.abs(wValues[i])>lc*Math.PI && Math.abs(wValues[i])<hc*Math.PI)
            {
                filValues.push(0);
            }
            else
            {
                filValues.push(1);
            }
        }
    }

    if(sel1==1)
    {
        for (var i=0; i<=200; i++)
        {
            if(Math.abs(wValues[i])<lc*Math.PI)
            {
                filValues1.push(1);
            }
            else
            {
                filValues1.push(0);
            }
        }
    }
    else if(sel1==2)
    {
        for (var i=0; i<=200; i++)
        {
            if(Math.abs(wValues[i])<lc*Math.PI)
            {
                filValues1.push(0);
            }
            else
            {
                filValues1.push(1);
            }
        }
    }
    else if(sel1==3)
    {
        if(lc>hc)
        {
            var temp = hc;
            hc = lc;
            lc = temp;
        }
        for (var i=0; i<=200; i++)
        {
            if(Math.abs(wValues[i])>lc*Math.PI && Math.abs(wValues[i])<hc*Math.PI)
            {
                filValues1.push(1);
            }
            else
            {
                filValues1.push(0);
            }
        }
    }
    else
    {
        if(lc>hc)
        {
            var temp = hc;
            hc = lc;
            lc = temp;
        }
        for (var i=0; i<=1000; i++)
        {
            if(Math.abs(wValues[i])>lc*Math.PI && Math.abs(wValues[i])<hc*Math.PI)
            {
                filValues1.push(0);
            }
            else
            {
                filValues1.push(1);
            }
        }
    }

    var outValues = math.dotMultiply(filValues,transOr);
    var outValues = shift(outValues);
    var ampSpecOut = [];
    var phSpecOut = [];
    for(var i=0; i<N; i++)
    {
        ampSpecOut.push(math.sqrt(math.pow(math.re(outValues[i]),2)+math.pow(math.im(outValues[i]),2)));
        phSpecOut.push(math.atan2(math.im(outValues[i]),math.re(outValues[i])));
    }

    var sigValuesOut = invFourier(outValues);
    var sigRealOut = [];
    for(var i=0; i<N; i++)
    {
        sigRealOut.push(math.re(sigValuesOut[i]));
    }

    sigRealOut = shift(sigRealOut); 

    var trace1 = {
        x: wValues,
        y: ampSpec,
        type: 'scatter',
        mode: 'line'
    };
    var trace2 = {
        x: wValues,
        y: filValues1,
        type: 'scatter',
        mode: 'line'
    };
    var trace3 = {
        x: wValues,
        y: ampSpecOut,
        type: 'scatter',
        mode: 'line'
    };
    var trace4 = {
        x: xValues,
        y: sigValues,
        type: 'scatter',
        mode: 'line'
    };
    var trace5 = {
        x: xValues,
        y: sigRealOut,
        mode: 'line'
    };
    var data1 = [trace1,trace2];
    var data2 = [trace3];
    var data3 = [trace4,trace5];

    var config = {responsive: true}

    var layout1 = {
        title: 'Magnitude Spectrum',
        xaxis: {
            title: 'Frequency'
        },
        yaxis: {
            title: 'Magnitude'
        },
        showlegend: false
    };

    var layout2 = {
        title: 'Time Domain',
        xaxis: {
            title: 'Time'
        },
        yaxis: {
            title: 'Amplitude'
        },
        showlegend: false
    };
      
    Plotly.newPlot('figure3', data1, layout1, config);
    
    if(screen.width < 769)
    {
        var update = {
            width: 0.9*screen.width,
            height: 400
        };
    }
    else
    {
        var update = {
            width: 500,
            height: 400
        };
    }

    Plotly.relayout('figure3', update);
    Plotly.newPlot('figure4', data2, layout1, config);
    
    if(screen.width < 769)
    {
        var update = {
            width: 0.9*screen.width,
            height: 400
        };
    }
    else
    {
        var update = {
            width: 500,
            height: 400
        };
    }

    Plotly.relayout('figure4', update);

    Plotly.newPlot('figure5', data3, layout2, config);
    
    if(screen.width < 769)
    {
        var update = {
            width: 0.9*screen.width,
            height: 400
        };
    }
    else
    {
        var update = {
            width: 500,
            height: 400
        };
    }

    Plotly.relayout('figure5', update);
}

// ------------------------------------------ Quiz 1 ----------------------------------------------------------

function mInit(){
    var wValues = makeArr(-Math.PI,Math.PI,201);
    var inValues = [];
    var outValues = [];
    for(var i=0; i<200; i++)
    {
        if(i==20 || i==40 || i==180 || i==160)
        {
            inValues.push(1);
        }
        else
        {
            inValues.push(0);
        }

        if(i==40 || i==160)
        {
            outValues.push(1);
        }
        else
        {
            outValues.push(0);
        }
    }
    var trace1 = {
        x: wValues,
        y: inValues,
        type: 'scatter',
        name: 'output',
        mode: 'markers'
    };
    var trace2 = {
        x: wValues,
        y: outValues,
        type: 'scatter',
        name: 'output',
        mode: 'markers'
    };
    var data1 = [trace1];
    var data2 = [trace2];

    var config = {responsive: true}

    var layout1 = {
        title: 'Magnitude Spectrum',
        xaxis: {
            title: 'Frequency'
        },
        yaxis: {
            title: 'Magnitude'
        }
    };
      
    Plotly.newPlot('figure6', data1, layout1, config);
    
    if(screen.width < 769)
    {
        var update = {
            width: 0.9*screen.width,
            height: 400
        };
    }
    else
    {
        var update = {
            width: 400,
            height: 400
        };
    }

    Plotly.relayout('figure6', update);

    Plotly.newPlot('figure7', data2, layout1, config);
    
    if(screen.width < 769)
    {
        var update = {
            width: 0.9*screen.width,
            height: 400
        };
    }
    else
    {
        var update = {
            width: 400,
            height: 400
        };
    }

    Plotly.relayout('figure7', update);
}

function mavg(){
    
    var sel1 = document.getElementById("sig-names3").value;
    sel1 = parseFloat(sel1);

    if(sel1==2)
    {
        var element = document.getElementById("result1")
        element.style.color = "#006400";
        element.style.fontWeight = "bold";
        element.innerHTML = 'Right Answer!';
    }
    else
    {
        var element = document.getElementById("result1")
        element.style.color = "#FF0000";
        element.style.fontWeight = "bold";
        element.innerHTML = 'Wrong Answer!';
    }
}

/* ----------------------------------------------- Quiz 2 --------------------------------- */

function qInit(){
    var wValues = makeArr(-Math.PI,Math.PI,201);
    var inValues = [];
    var outValues = [];
    for(var i=0; i<200; i++)
    {
        if(i==20 || i==40 || i==180 || i==160)
        {
            inValues.push(1);
        }
        else
        {
            inValues.push(0);
        }

        if(i==40 || i==160)
        {
            outValues.push(1);
        }
        else
        {
            outValues.push(0);
        }
    }
    var trace1 = {
        x: wValues,
        y: inValues,
        type: 'scatter',
        name: 'output',
        mode: 'markers'
    };
    var trace2 = {
        x: wValues,
        y: outValues,
        type: 'scatter',
        name: 'output',
        mode: 'markers'
    };
    var data1 = [trace1];
    var data2 = [trace2];

    var config = {responsive: true}

    var layout1 = {
        title: 'Magnitude Spectrum',
        xaxis: {
            title: 'Frequency'
        },
        yaxis: {
            title: 'Magnitude'
        }
    };
      
    Plotly.newPlot('figure8', data1, layout1, config);
    
    if(screen.width < 769)
    {
        var update = {
            width: 0.9*screen.width,
            height: 400
        };
    }
    else
    {
        var update = {
            width: 500,
            height: 400
        };
    }

    Plotly.relayout('figure8', update);

    Plotly.newPlot('figure9', data2, layout1, config);
    
    if(screen.width < 769)
    {
        var update = {
            width: 0.9*screen.width,
            height: 400
        };
    }
    else
    {
        var update = {
            width: 500,
            height: 400
        };
    }
    
    Plotly.relayout('figure9', update);
}

function mavg1(){
    
    var sel1 = document.getElementById("sig-names4").value;
    sel1 = parseFloat(sel1);
    var lc = document.getElementById("cutoff3").value;
    lc = parseFloat(lc);
    lc = lc*Math.PI;
    var hc = document.getElementById("cutoff4").value;
    hc = parseFloat(hc);
    hc = hc*Math.PI;

    if(sel1==2)
    {
        var element = document.getElementById("result2")
        element.style.color = "#FF0000";
        element.style.fontWeight = "bold";
        element.innerHTML = 'Wrong Answer!';
    }
    else
    {
        var wValues = makeArr(-Math.PI,Math.PI,201);
        var f1 = wValues[160];
        var f2 = wValues[180];
        if(sel1==1)
        {
            if(lc>=f1 && lc<=f2)
            {
                var element = document.getElementById("result2")
                element.style.color = "#006400";
                element.style.fontWeight = "bold";
                element.innerHTML = 'Right Answer!';
            }
            else
            {
                var element = document.getElementById("result2")
                element.style.color = "#FF0000";
                element.style.fontWeight = "bold";
                element.innerHTML = 'Wrong Answer!';
            }
        }
        else if(sel1==3)
        {
            if(lc<=f1 && hc>=f1 && hc<=f2)
            {
                var element = document.getElementById("result2")
                element.style.color = "#006400";
                element.style.fontWeight = "bold";
                element.innerHTML = 'Right Answer!';
            }
            else
            {
                var element = document.getElementById("result2")
                element.style.color = "#FF0000";
                element.style.fontWeight = "bold";
                element.innerHTML = 'Wrong Answer!';
            }
        }
        else
        {
            if(lc>=f1 && lc<=f2 && hc>=f2)
            {
                var element = document.getElementById("result2")
                element.style.color = "#006400";
                element.style.fontWeight = "bold";
                element.innerHTML = 'Right Answer!';
            }
            else
            {
                var element = document.getElementById("result2")
                element.style.color = "#FF0000";
                element.style.fontWeight = "bold";
                element.innerHTML = 'Wrong Answer!';
            }
        }
    }
}

/* ---------------------------- LinSpace -------------------------------------- */

function makeArr(startValue, stopValue, cardinality) {
    var arr = [];
    var step = (stopValue - startValue) / (cardinality - 1);
    for (var i = 0; i < cardinality; i++) {
      arr.push(startValue + (step * i));
    }
    return arr;
}

// ------------------------------------------ On startup ----------------------------------------------------------

function startup()
{
    fourier(1);
    //syst();
    mInit();
    qInit();
    document.getElementById("default").click();
}

window.onload = startup;