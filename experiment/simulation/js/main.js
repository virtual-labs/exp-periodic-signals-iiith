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

    if(!name.localeCompare('FCC'))
    {
        series();
        renderMathInElement(document.body);
    }
    else if(!name.localeCompare('SCC'))
    {
        sqSeries();
        renderMathInElement(document.body);
    }
    else if(!name.localeCompare('FCR'))
    {
        fourier(1);
        renderMathInElement(document.body);
    }
    else if(!name.localeCompare('SQS'))
    {
        quant(1);
        renderMathInElement(document.body);
    }
    else
    {
        renderMathInElement(document.body);
    }
}

var k;
var p;
var sigChoice;
var scaleChoice;
var delayChoice;
var boxChoice;
var yValues;
var inValues;
let isConvolutionOn = 0;


// ------------------------------------------- Slider --------------------------------------------------------------------

var slider = document.getElementById("myRange");

slider.oninput = function() {
  fourier(this.value);
}

var squareSlider = document.getElementById("sqSlider");

squareSlider.oninput = function() {
  quant(this.value);
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

// ----------------------------------------- Fourier series of known signals - coeff ----------------------------------------------

function series()
{
    var chosen = document.getElementById("dropDownSeries").value;
    var choice = parseInt(chosen);

    if(choice==1)
    {
        squareCoeff();
    }
    else if(choice==2)
    {
        triangleCoeff();
    }
    else if(choice==3)
    {
        halfwaveCoeff();
    }
    else if(choice==4)
    {
        fullwaveCoeff();
    }
    else
    {
        customCoeff();
    }
}

function squareCoeff() {  
    var num = 20;
    N = 1000;
    f = 1/(4*Math.PI);
    w0 = 2*Math.PI*f;

    // Adjust the range to cover 3-4 cycles
    var xValues = makeArr(0, 12*Math.PI, N);
    var sigValues = makeArr(0, 0, N);
    var kValues = makeArr(0, num, num+1);

    var a0 = 0;
    var ak = makeArr(0, 0, num+1);
    var bk = makeArr(0, 0, num+1);

    ak[0] = a0;
    
    for(var k=1; k<=num; k++) {
        if(k%2==1) {
            bk[k] = 4/(Math.PI*k);
        }
    }

    var boxSignal = [];
    for(var i=0; i<N; i++) {
        if(i < N/6) {
            boxSignal.push(1);
        } else if (i < N/3) {
            boxSignal.push(-1);
        } else if (i < N/2) {
            boxSignal.push(1);
        } else if (i < 2*N/3) {
            boxSignal.push(-1);
        } else if (i < 5*N/6) {
            boxSignal.push(1);
        } else {
            boxSignal.push(-1);
        }
    }

    var trace1 = {
        x: xValues,
        y: boxSignal,
        type: 'scatter',
        mode: 'line'
    };

    var trace2 = {
        x: kValues,
        y: ak,
        type: 'scatter',
        mode: 'markers'
    };

    var trace3 = {
        x: kValues,
        y: bk,
        type: 'scatter',
        mode: 'markers'
    };

    var layout1 = {
        title: 'Original Signal',
        showlegend: false,
        xaxis: {
            title: 'Time (s)'
        },
        yaxis: {
            title: 'Magnitude'
        }
    };

    var layout2 = {
        title: 'Fourier Coefficients',
        showlegend: false,
        xaxis: {
            title: 'k'
        },
        yaxis: {
            title: 'ak'
        }
    };

    var layout3 = {
        title: 'Fourier Coefficients',
        showlegend: false,
        xaxis: {
            title: 'k'
        },
        yaxis: {
            title: 'bk'
        }
    };
      
    var data1 = [trace1];
    var data2 = [trace2];
    var data3 = [trace3];

    var config = {responsive: true}
    
    if(screen.width < 769) {
        var update = {
            width: 0.8*screen.width,
            height: 400
        };
    } else if(screen.width > 1600) {
        var update = {
            width: 0.55*screen.width,
            height: 400
        };
    } else {
        var update = {
            width: 500,
            height: 500
        };
    }

    Plotly.newPlot('figure1', data1, layout1, config);
    Plotly.relayout('figure1', update);

    Plotly.newPlot('figure2', data2, layout2, config);
    Plotly.relayout('figure2', update);

    Plotly.newPlot('figure3', data3, layout3, config);
    Plotly.relayout('figure3', update);
}


function triangleCoeff() {    
    var num = 20;
    N = 1000;
    f = 1/2;
    w0 = 2*Math.PI*f;

    // Adjust the range to cover 1 cycle
    var xValues = makeArr(0, 2, N);
    var sigValues = makeArr(0, 0, N);
    var kValues = makeArr(0, num, num+1);

    var a0 = 0;
    var ak = makeArr(0, 0, num+1);
    var bk = makeArr(0, 0, num+1);

    ak[0] = a0;
    
    for(var k=1; k<=num; k++) {
        if(k%2==1) {
            var val = parseInt((k-1)/2);
            if(val%2 == 1) {
                bk[k] =  -8/(Math.PI*Math.PI*k*k);
            } else {
                bk[k] = 8/(Math.PI*Math.PI*k*k);
            }
        }
    }

    var triangleSignal = [];
    for(var i=0; i<N; i++) {
        if(i<N/4) {
            triangleSignal.push(2*xValues[i]);
        } else if(i<(3*N/4)) {
            triangleSignal.push(2*(1-xValues[i]));
        } else {
            triangleSignal.push(2*(xValues[i]-2));
        }
    }

    // Concatenate the signal to cover 3-4 cycles
    var extendedXValues = [];
    var extendedTriangleSignal = [];
    for (var j = 0; j < 4; j++) {
        extendedXValues = extendedXValues.concat(xValues.map(x => x + j * 2));
        extendedTriangleSignal = extendedTriangleSignal.concat(triangleSignal);
    }

    var trace1 = {
        x: extendedXValues,
        y: extendedTriangleSignal,
        type: 'scatter',
        mode: 'lines'
    };

    var trace2 = {
        x: kValues,
        y: ak,
        type: 'scatter',
        mode: 'markers'
    };

    var trace3 = {
        x: kValues,
        y: bk,
        type: 'scatter',
        mode: 'markers'
    };

    var layout1 = {
        title: 'Original Signal',
        showlegend: false,
        xaxis: {
            title: 'Time (s)'
        },
        yaxis: {
            title: 'Magnitude'
        }
    };

    var layout2 = {
        title: 'Fourier Coefficients',
        showlegend: false,
        xaxis: {
            title: 'k'
        },
        yaxis: {
            title: 'ak'
        }
    };

    var layout3 = {
        title: 'Fourier Coefficients',
        showlegend: false,
        xaxis: {
            title: 'k'
        },
        yaxis: {
            title: 'bk'
        }
    };
      
    var data1 = [trace1];
    var data2 = [trace2];
    var data3 = [trace3];

    var config = {responsive: true}
    
    if(screen.width < 769) {
        var update = {
            width: 0.8*screen.width,
            height: 400
        };
    } else if(screen.width > 1600) {
        var update = {
            width: 0.55*screen.width,
            height: 400
        };
    } else {
        var update = {
            width: 500,
            height: 500
        };
    }

    Plotly.newPlot('figure1', data1, layout1, config);
    Plotly.relayout('figure1', update);

    Plotly.newPlot('figure2', data2, layout2, config);
    Plotly.relayout('figure2', update);

    Plotly.newPlot('figure3', data3, layout3, config);
    Plotly.relayout('figure3', update);
}

function halfwaveCoeff() {
    var num = 20;
    N = 1000;
    f = 1/(2*Math.PI);
    w0 = 2*Math.PI*f;

    var xValues = makeArr(0, 2*Math.PI, N);
    var sigValues = makeArr(0, 0, N);
    var kValues = makeArr(0, num, num+1);

    var a0 = 0.318;
    var ak = makeArr(0, 0, num+1);
    var bk = makeArr(0, 0, num+1);

    ak[0] = a0;
    
    for(var k=1; k<=num; k++) {
        if(k==1) {
            bk[k] = 0.5;
        }
        if(k%2==0) {
            ak[k] = 2/((1-(k*k))*(Math.PI));
        }
    }

    var mySignal = [];
    for(var i=0; i<N; i++) {
        if(i<N/2) {
            mySignal.push(Math.sin(xValues[i]));
        } else {
            mySignal.push(0);
        }
    }

    // Concatenate the signal to cover 3-4 cycles
    var extendedXValues = [];
    var extendedMySignal = [];
    for (var j = 0; j < 4; j++) {
        extendedXValues = extendedXValues.concat(xValues.map(x => x + j * 2 * Math.PI));
        extendedMySignal = extendedMySignal.concat(mySignal);
    }

    var trace1 = {
        x: extendedXValues,
        y: extendedMySignal,
        type: 'scatter',
        mode: 'lines'
    };

    var trace2 = {
        x: kValues,
        y: ak,
        type: 'scatter',
        mode: 'markers'
    };

    var trace3 = {
        x: kValues,
        y: bk,
        type: 'scatter',
        mode: 'markers'
    };

    var layout1 = {
        title: 'Original Signal',
        showlegend: false,
        xaxis: {
            title: 'Time (s)'
        },
        yaxis: {
            title: 'Magnitude'
        }
    };

    var layout2 = {
        title: 'Fourier Coefficients',
        showlegend: false,
        xaxis: {
            title: 'k'
        },
        yaxis: {
            title: 'ak'
        }
    };

    var layout3 = {
        title: 'Fourier Coefficients',
        showlegend: false,
        xaxis: {
            title: 'k'
        },
        yaxis: {
            title: 'bk'
        }
    };
      
    var data1 = [trace1];
    var data2 = [trace2];
    var data3 = [trace3];

    var config = {responsive: true}
    
    if(screen.width < 769) {
        var update = {
            width: 0.8*screen.width,
            height: 400
        };
    } else if(screen.width > 1600) {
        var update = {
            width: 0.55*screen.width,
            height: 400
        };
    } else {
        var update = {
            width: 500,
            height: 500
        };
    }

    Plotly.newPlot('figure1', data1, layout1, config);
    Plotly.relayout('figure1', update);

    Plotly.newPlot('figure2', data2, layout2, config);
    Plotly.relayout('figure2', update);

    Plotly.newPlot('figure3', data3, layout3, config);
    Plotly.relayout('figure3', update);
}

function fullwaveCoeff() {
    var num = 20;
    N = 1000;
    f = 1/(2*Math.PI);
    w0 = 2*Math.PI*f;

    var xValues = makeArr(0, 2*Math.PI, N);
    var sigValues = makeArr(0, 0, N);
    var kValues = makeArr(0, num, num+1);

    var a0 = -0.65;
    var ak = makeArr(0, 0, num+1);
    var bk = makeArr(0, 0, num+1);
    
    for(var k=0; k<=num; k++) {
        if(k%2==0) {
            ak[k] = 2/((1-(k*k))*(1.56));
        }
    }

    ak[0] = ak[0] + a0;

    var mySignal = [];
    for(var i=0; i<N; i++) {
        if(i<N/2) {
            mySignal.push(Math.sin(xValues[i]));
        } else {
            mySignal.push(-Math.sin(xValues[i]));
        }
    }

    // Concatenate the signal to cover 3-4 cycles
    var extendedXValues = [];
    var extendedMySignal = [];
    for (var j = 0; j < 4; j++) {
        extendedXValues = extendedXValues.concat(xValues.map(x => x + j * 2 * Math.PI));
        extendedMySignal = extendedMySignal.concat(mySignal);
    }

    var trace1 = {
        x: extendedXValues,
        y: extendedMySignal,
        type: 'scatter',
        mode: 'lines'
    };

    var trace2 = {
        x: kValues,
        y: ak,
        type: 'scatter',
        mode: 'markers'
    };

    var trace3 = {
        x: kValues,
        y: bk,
        type: 'scatter',
        mode: 'markers'
    };

    var layout1 = {
        title: 'Original Signal',
        showlegend: false,
        xaxis: {
            title: 'Time (s)'
        },
        yaxis: {
            title: 'Magnitude'
        }
    };

    var layout2 = {
        title: 'Fourier Coefficients',
        showlegend: false,
        xaxis: {
            title: 'k'
        },
        yaxis: {
            title: 'ak'
        }
    };

    var layout3 = {
        title: 'Fourier Coefficients',
        showlegend: false,
        xaxis: {
            title: 'k'
        },
        yaxis: {
            title: 'bk'
        }
    };
      
    var data1 = [trace1];
    var data2 = [trace2];
    var data3 = [trace3];

    var config = {responsive: true}
    
    if(screen.width < 769) {
        var update = {
            width: 0.8*screen.width,
            height: 400
        };
    } else if(screen.width > 1600) {
        var update = {
            width: 0.55*screen.width,
            height: 400
        };
    } else {
        var update = {
            width: 500,
            height: 500
        };
    }

    Plotly.newPlot('figure1', data1, layout1, config);
    Plotly.relayout('figure1', update);

    Plotly.newPlot('figure2', data2, layout2, config);
    Plotly.relayout('figure2', update);

    Plotly.newPlot('figure3', data3, layout3, config);
    Plotly.relayout('figure3', update);
}

function customCoeff()
{
    var num = 20;
    N = 1000;
    f = 1/(4*Math.PI);
    w0 = 2*Math.PI*f;

    var xValues = makeArr(0,4*Math.PI,N);
    var sigValues = makeArr(0,0,N);
    var kValues = makeArr(0,num,num+1);

    var a0 = 0;
    var ak = makeArr(0,0,num+1);
    var bk = makeArr(0,0,num+1);

    ak[0] = a0;
    
    for(var k=1; k<=num; k++)
    {
        if(k%2==1)
        {
            bk[k] = (1/(4*Math.PI))*((((Math.sin(k*w0*Math.PI))/(1-k*w0))+((Math.sin(k*w0*Math.PI))/(1+k*w0))) + 2*((Math.cos(Math.PI*k*w0)-Math.cos(2*Math.PI*k*w0))/(k*w0)) + 2*((Math.cos(3*Math.PI*k*w0)-Math.cos(2*Math.PI*k*w0))/(k*w0)) - (((Math.sin(4*Math.PI*k*w0)+Math.sin(3*Math.PI*k*w0))/(1-k*w0)) + ((Math.sin(4*Math.PI*k*w0)+Math.sin(3*Math.PI*k*w0))/(1+k*w0))));
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
        y: mySignal,
        type: 'scatter',
        mode: 'line'
    };

    var trace2 = {
        x: kValues,
        y: ak,
        type: 'scatter',
        mode: 'markers'
    };

    var trace3 = {
        x: kValues,
        y: bk,
        type: 'scatter',
        mode: 'markers'
    };

    var layout1 = {
        title: 'Original Signal',
        showlegend: false,
        xaxis: {
            title: 'Time (s)'
        },
        yaxis: {
            title: 'Magnitude'
        }
    };

    var layout2 = {
        title: 'Fourier Coefficients',
        showlegend: false,
        xaxis: {
            title: 'k'
        },
        yaxis: {
            title: 'ak'
        }
    };

    var layout3 = {
        title: 'Fourier Coefficients',
        showlegend: false,
        xaxis: {
            title: 'k'
        },
        yaxis: {
            title: 'bk'
        }
    };
      
    var data1 = [trace1];
    var data2 = [trace2];
    var data3 = [trace3];

    var config = {responsive: true}
    
    if(screen.width < 769)
    {
        var update = {
            width: 0.8*screen.width,
            height: 400
        };
    }
    else if(screen.width > 1600)
    {
        var update = {
            width: 0.55*screen.width,
            height: 400
        };
    }
    else
    {
        var update = {
            width: 500,
            height: 500
        };
    }

    Plotly.newPlot('figure1', data1, layout1, config);
    Plotly.relayout('figure1', update);

    Plotly.newPlot('figure2', data2, layout2, config);
    Plotly.relayout('figure2', update);

    Plotly.newPlot('figure3', data3, layout3, config);
    Plotly.relayout('figure3', update);
}

// ------------------------------------- Fourier Series of known signals - slider ----------------------------------------------------


function callFourier() {
    fourier(1);
    // Set the slider value to 1
    document.getElementById("myRange").value = 1;
}


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
    else if(choice==3)
    {
        halfwave(numCoeff);
    }
    else if(choice==4)
    {
        fullwave(numCoeff);
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

    Plotly.newPlot('figure4', data1, layout1, config);

    Plotly.relayout('figure4', update);
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

    Plotly.newPlot('figure4', data1, layout1, config);

    Plotly.relayout('figure4', update);
}

function halfwave(numCoeff)
{
    var num = parseInt(numCoeff);
    N = 1000;
    f = 1/(2*Math.PI);
    w0 = 2*Math.PI*f;

    var xValues = makeArr(0,2*Math.PI,N);
    var sigValues = makeArr(0.318,0.318,N);
    
    for(var k=1; k<=num; k++)
    {
        for(var i=0; i<N; i++)
        {
            if(k==1)
            {
                var value = 0.5;
                sigValues[i] = sigValues[i] + value*Math.sin(k*w0*xValues[i]);
            }
            if(k%2==0)
            {
                var value = 2/((1-(k*k))*(Math.PI));
                sigValues[i] = sigValues[i] + value*Math.cos(k*w0*xValues[i]);
            }
        }
    }

    var mySignal = [];
    for(var i=0; i<N; i++)
    {
        if(i<N/2)
        {
            mySignal.push(Math.sin(xValues[i]));
        }
        else
        {
            mySignal.push(0);
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

    Plotly.newPlot('figure4', data1, layout1, config);

    Plotly.relayout('figure4', update);
}

function fullwave(numCoeff)
{
    var num = parseInt(numCoeff);
    N = 1000;
    f = 1/(2*Math.PI);
    w0 = 2*Math.PI*f;

    var xValues = makeArr(0,2*Math.PI,N);
    var sigValues = makeArr(-0.65,-0.65,N);
    
    for(var k=0; k<=num; k++)
    {
        for(var i=0; i<N; i++)
        {
            if(k%2==0)
            {
                var value = 2/((1-(k*k))*(1.56));
                sigValues[i] = sigValues[i] + value*Math.cos(k*w0*xValues[i]);
            }
        }
    }

    var mySignal = [];
    for(var i=0; i<N; i++)
    {
        if(i<N/2)
        {
            mySignal.push(Math.sin(xValues[i]));
        }
        else
        {
            mySignal.push(-Math.sin(xValues[i]));
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

    Plotly.newPlot('figure4', data1, layout1, config);

    Plotly.relayout('figure4', update);
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

    Plotly.newPlot('figure4', data1, layout1, config);

    Plotly.relayout('figure4', update);
}

// ---------------------------------------------------- Calculate fourier series coefficients -------------------------------------

function integrate(x, T) 
{
    N = x.length;
    let dt = T/N;
    let sum = 0.5 * (x[0]+x[N-1]);

    for (var i=1; i<N-1; i++) {
        sum += x[i];
    }

    return sum * dt;
}

function calculateSquareCoefficient_ak(x, T, kMax, t)
{
    // ak = 2/T \int_{0}^{T} x(t) cos(k*w0*t) dt
    var ak = [];
    var y = x.slice();
    for(k=0; k<=kMax; k++)
    {
        y = x.slice();
        for(var i=0; i<y.length; i++)
        {
            if(Math.cos(k*2*Math.PI*t[i]/T)<=0)
            {
                y[i] = -y[i];
            }
        }
        var ak_here = integrate(y,T);
        ak.push(2*ak_here/T);
    }

    return ak;
}

function calculateSquareCoefficient_bk(x, T, kMax, t)
{
    // bk = 2/T \int_{0}^{T} x(t) sin(k*w0*t) dt
    var bk = [];
    var y = x.slice();
    var N = y.length;
    for(k=0; k<=kMax; k++)
    {
        y = x.slice();
        for(var i=0; i<N; i++)
        {
            if(Math.sin(k*2*Math.PI*t[i]/T)<0)
            {
                y[i] = -y[i];
            }
        }
        var bk_here = integrate(y,T);
        bk.push(bk_here/T);
    }

    return bk;
}

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

// -------------------------------------------- Square Wave series - slider -----------------------------------------------------

function quantize(value)
{
    if(value>0)
    {
        return 1;
    }
    else
    {
        return -1;
    }
}

function callQuant()
{
    quant(1);
    document.getElementById("sqSlider").value = 1;
}

function quant(numCoeff)
{
    var chosen = document.getElementById("dropDownSquare").value;
    var choice = parseInt(chosen);

    if(choice==1)
    {
        squareQ(numCoeff);
    }
    else if(choice==2)
    {
        triangleQ(numCoeff);
    }
    else if(choice==3)
    {
        halfwaveQ(numCoeff);
    }
    else if(choice==4)
    {
        fullwaveQ(numCoeff);
    }
    else
    {
        customQ(numCoeff);
    }
}

function generateAndPlotQ(ak,bk, xValues, mySignal, num, T)
{
    var w0 = 2*Math.PI/T;
    var N = xValues.length;
    var sigValues = makeArr(0,0,N);

    for(var k=0; k<=num; k++)
    {
        for(var i=0; i<N; i++)
        {
            sigValues[i] = sigValues[i] + ak[k]*quantize(Math.cos(k*w0*xValues[i])) + bk[k]*quantize(Math.sin(k*w0*xValues[i]));
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

    Plotly.newPlot('figure8', data1, layout1, config);

    Plotly.relayout('figure8', update);
}

function squareQ(numCoeff)
{
    var num = parseInt(numCoeff);
    var N = 1000;
    var T = 1;

    var xValues = makeArr(0,1,N);

    var boxSignalQ = [];
    for(var i=0; i<N; i++)
    {
        if(i<N/2)
        {
            boxSignalQ.push(1);
        }
        else
        {
            boxSignalQ.push(-1);
        }
    }

    var temp = boxSignalQ.slice();

    var ak = calculateSquareCoefficient_ak(boxSignalQ, T, num, xValues);
    var bk = calculateSquareCoefficient_bk(boxSignalQ, T, num, xValues);

    var w0 = 2*Math.PI/T;
    var sigValues = makeArr(0,0,N);

    for(var k=0; k<=num; k++)
    {
        for(var i=0; i<N; i++)
        {
            sigValues[i] = sigValues[i] + ak[k]*quantize(Math.cos(k*w0*xValues[i])) + bk[k]*quantize(Math.sin(k*w0*xValues[i]));
        }
    }

    generateAndPlotQ(ak,bk, xValues, temp, num, T);
}

function triangleQ(numCoeff)
{
    var num = parseInt(numCoeff);
    var N = 1000;
    var T = 2;

    var xValues = makeArr(0,2,N);

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

    var temp = triangleSignal.slice();
    var ak = calculateSquareCoefficient_ak(triangleSignal, T, num, xValues);
    var bk = calculateSquareCoefficient_bk(triangleSignal, T, num, xValues);
    
    generateAndPlotQ(ak,bk, xValues, temp, num, T);
}

function halfwaveQ(numCoeff)
{
    var num = parseInt(numCoeff);
    var N = 1000;
    var T = 2*Math.PI;

    var xValues = makeArr(0,2*Math.PI,N);

    var mySignal = [];
    for(var i=0; i<N; i++)
    {
        if(i<N/2)
        {
            mySignal.push(Math.sin(xValues[i]));
        }
        else
        {
            mySignal.push(0);
        }
    }

    var ak = calculateSquareCoefficient_ak(mySignal, T, num, xValues);
    var bk = calculateSquareCoefficient_bk(mySignal, T, num, xValues);
    
    generateAndPlotQ(ak,bk, xValues, mySignal, num, T);
}

function fullwaveQ(numCoeff)
{
    var num = parseInt(numCoeff);
    var N = 1000;
    var T = 2*Math.PI;

    var xValues = makeArr(0,2*Math.PI,N);

    var mySignal = [];
    for(var i=0; i<N; i++)
    {
        if(i<N/2)
        {
            mySignal.push(Math.sin(xValues[i]));
        }
        else
        {
            mySignal.push(-Math.sin(xValues[i]));
        }
    }

    var ak = calculateSquareCoefficient_ak(mySignal, T, num, xValues);
    var bk = calculateSquareCoefficient_bk(mySignal, T, num, xValues);
    
    generateAndPlotQ(ak,bk, xValues, mySignal, num, T);
}

function customQ(numCoeff)
{
    var num = parseInt(numCoeff);
    var N = 1000;
    var T = 4*Math.PI;

    var xValues = makeArr(0,4*Math.PI,N);

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

    var ak = calculateSquareCoefficient_ak(mySignal, T, num, xValues);
    var bk = calculateSquareCoefficient_bk(mySignal, T, num, xValues);
    
    generateAndPlotQ(ak,bk, xValues, mySignal, num, T);
}

//--------------------------------------------- Square wave coefficients ------------------------------------------------------

function plotSqCoeff(ak,bk,xValues,kValues,mySignal)
{
    var trace1 = {
        x: xValues,
        y: mySignal,
        type: 'scatter',
        mode: 'line'
    };

    var trace2 = {
        x: kValues,
        y: ak,
        type: 'scatter',
        mode: 'markers'
    };

    var trace3 = {
        x: kValues,
        y: bk,
        type: 'scatter',
        mode: 'markers'
    };

    var layout1 = {
        title: 'Original Signal',
        showlegend: false,
        xaxis: {
            title: 'Time (s)'
        },
        yaxis: {
            title: 'Magnitude'
        }
    };

    var layout2 = {
        title: 'Fourier Coefficients',
        showlegend: false,
        xaxis: {
            title: 'k'
        },
        yaxis: {
            title: 'ak'
        }
    };

    var layout3 = {
        title: 'Fourier Coefficients',
        showlegend: false,
        xaxis: {
            title: 'k'
        },
        yaxis: {
            title: 'bk'
        }
    };
      
    var data1 = [trace1];
    var data2 = [trace2];
    var data3 = [trace3];

    var config = {responsive: true}
    
    if(screen.width < 769)
    {
        var update = {
            width: 0.8*screen.width,
            height: 400
        };
    }
    else if(screen.width > 1600)
    {
        var update = {
            width: 0.55*screen.width,
            height: 400
        };
    }
    else
    {
        var update = {
            width: 500,
            height: 500
        };
    }

    Plotly.newPlot('figure5', data1, layout1, config);
    Plotly.relayout('figure5', update);

    Plotly.newPlot('figure6', data2, layout2, config);
    Plotly.relayout('figure6', update);

    Plotly.newPlot('figure7', data3, layout3, config);
    Plotly.relayout('figure7', update);
}

function sqSeries()
{
    var chosen = document.getElementById("dropDownSqSeries").value;
    var choice = parseInt(chosen);

    var num = 20;
    var kValues = makeArr(0,num,num+1);
    var N = 1000;

    if(choice==1)
    {
        var T = 1;

        var xValues = makeArr(0,T,N);

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

        var mySignal = boxSignal.slice();

        var ak = calculateSquareCoefficient_ak(mySignal, T, num, xValues);
        var bk = calculateSquareCoefficient_bk(mySignal, T, num, xValues);

        plotSqCoeff(ak,bk,xValues,kValues,boxSignal);
    }
    else if(choice==2)
    {
        var T = 2;

        var xValues = makeArr(0,T,N);

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

        var mySignal = triangleSignal.slice();

        var ak = calculateSquareCoefficient_ak(mySignal, T, num, xValues);
        var bk = calculateSquareCoefficient_bk(mySignal, T, num, xValues);

        plotSqCoeff(ak,bk,xValues,kValues,triangleSignal);
    }
    else if(choice==3)
    {
        var T = 2*Math.PI;

        var xValues = makeArr(0,T,N);

        var mySignal = [];
        for(var i=0; i<N; i++)
        {
            if(i<N/2)
            {
                mySignal.push(Math.sin(xValues[i]));
            }
            else
            {
                mySignal.push(0);
            }
        }

        var mySignal1 = mySignal.slice();

        var ak = calculateSquareCoefficient_ak(mySignal1, T, num, xValues);
        var bk = calculateSquareCoefficient_bk(mySignal1, T, num, xValues);

        plotSqCoeff(ak,bk,xValues,kValues,mySignal);
    }
    else if(choice==4)
    {
        var T = 2*Math.PI;

        var xValues = makeArr(0,T,N);

        var mySignal = [];
        for(var i=0; i<N; i++)
        {
            if(i<N/2)
            {
                mySignal.push(Math.sin(xValues[i]));
            }
            else
            {
                mySignal.push(-Math.sin(xValues[i]));
            }
        }

        var mySignal1 = mySignal.slice();

        var ak = calculateSquareCoefficient_ak(mySignal1, T, num, xValues);
        var bk = calculateSquareCoefficient_bk(mySignal1, T, num, xValues);

        plotSqCoeff(ak,bk,xValues,kValues,mySignal);
    }
    else
    {
        var T = 4*Math.PI;

        var xValues = makeArr(0,T,N);

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

        var mySignal1 = mySignal.slice();

        var ak = calculateSquareCoefficient_ak(mySignal1, T, num, xValues);
        var bk = calculateSquareCoefficient_bk(mySignal1, T, num, xValues);

        plotSqCoeff(ak,bk,xValues,kValues,mySignal);
    }
}

// ------------------------------------------------ Quasi - Periodic -----------------------------------------------------------

const kanvas = document.getElementById("pendulumCanvas");
const ctx = kanvas.getContext("2d");

var iterQuasi = 0;
var intID = 0;

var t1acc = [];
var t2acc = [];
var toime = [];
var TIME = 0;

var trace1 = [];
var trace2 = [];

let theta1 = Math.PI / 4; // Initial angle of the first pendulum
let theta2 = Math.PI / 8; // Initial angle of the second pendulum

var heartRate = 0;
        
let omega1 = 0; // Initial angular velocity of the first pendulum
let omega2 = 0; // Initial angular velocity of the second pendulum


function toggleConvolution() {
    isConvolutionOn = !isConvolutionOn;
    if (isConvolutionOn) {
        performConvolution();
        document.getElementById("convolveButton").innerText = "Remove Convolution";
    } else {
        Plotly.purge('figure10');
        document.getElementById("convolveButton").innerText = "Convolve";
    }
}

function addAWGN(signal, variance) {
    return signal.map(value => value +  (Math.sqrt(variance / 2) * gaussianRandom())*0.05);
}
function gaussianRandom() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}


function quasi() {
    var chosen = document.getElementById("dropDownQuasi").value;
    var choice = parseInt(chosen);

    if (choice == 1) {
        document.getElementById("stop").style.display = "none";
        kanvas.style.display = "none";
        const ecgData = generateECGSignal();
        const noiseVariance = parseFloat(document.getElementById("ecgNoiseSlider").value);
        const noisyECGData = addAWGN(ecgData, noiseVariance);
        window.ecgData = noisyECGData;

        // Plot the ECG-like signal
        var trace = {
            x: Array.from({ length: noisyECGData.length }, (_, i) => i / 1000), // Convert to seconds
            y: noisyECGData,
            type: 'scatter',
            mode: 'line'
        };

        var layout = {
            title: 'Noisy ECG Signal',
            showlegend: false,
            xaxis: {
                title: 'Time (s)'
            },
            yaxis: {
                title: 'Amplitude'
            }
        };

        var data = [trace];

        var config = { responsive: true }

        Plotly.newPlot('figure9', data, layout, config);

        // Clear the convolved signal plot
        Plotly.purge('figure10');
    } else if (choice == 2) {
        Plotly.purge('figure9');

        document.getElementById("stop").style.display = "block";
        kanvas.style.display = "block";
        iterQuasi = 0;
        t1acc = [];
        t2acc = [];
        toime = [];
        TIME = 0;
        trace1 = [];
        trace2 = [];
        ctx.clearRect(0, 0, kanvas.width, kanvas.height);
        stopVisible();
        theta1 = Math.PI / 4; // Initial angle of the first pendulum
        theta2 = Math.PI / 8; // Initial angle of the second pendulum
        omega1 = 0; // Initial angular velocity of the first pendulum
        omega2 = 0; // Initial angular velocity of the second pendulum
        t1acc.push(theta1);
        toime.push(0);
        t2acc.push(theta2);
        intID = setInterval(updatePendulum, 1);
    }
}

const g = 9.81; // Acceleration due to gravity
const length1 = 2; // Length of the first pendulum arm
const length2 = 3; // Length of the second pendulum arm

const timeStep = 0.005; // Time step for simulation
const traceLength = 100; // Number of points to trace the motion



function updatePendulum() {
    // Pendulum physics calculations
    const num1 = -g * (2 * length1 + length2) * Math.sin(theta1);
    const num2 = -length2 * g * Math.sin(theta1 - 2 * theta2);
    const num3 = -2 * Math.sin(theta1 - theta2) * length2;
    const num4 = omega2 * omega2 * length2 + omega1 * omega1 * length1 * Math.cos(theta1 - theta2);
    const den = length1 * (2 * length1 + length2 - length2 * Math.cos(2 * theta1 - 2 * theta2));

    const a1 = (num1 + num2 + num3 * num4) / den;

    const num5 = 2 * Math.sin(theta1 - theta2);
    const num6 = (omega1 * omega1 * length1 * (length1 + length2));
    const num7 = g * (length1 + length2) * Math.cos(theta1);
    const num8 = omega2 * omega2 * length2 * length2 * Math.cos(theta1 - theta2);
    const den2 = length2 * (2 * length1 + length2 - length2 * Math.cos(2 * theta1 - 2 * theta2));

    const a2 = (num5 * (num6 + num7 + num8)) / den2;

    omega1 += a1 * timeStep;
    omega2 += a2 * timeStep;
    theta1 += omega1 * timeStep;
    theta2 += omega2 * timeStep;

    // Store the angles for plotting
    t1acc.push(theta1);
    t2acc.push(theta2);
    toime.push(TIME);
    TIME += timeStep;

    // Draw the pendulum
    const x1 = length1 * Math.sin(theta1);
    const y1 = length1 * Math.cos(theta1);
    const x2 = x1 + length2 * Math.sin(theta2);
    const y2 = y1 + length2 * Math.cos(theta2);

    drawPendulum(x1, y1, x2, y2);
}

function drawPendulum(x1, y1, x2, y2) {
    ctx.clearRect(0, 0, kanvas.width, kanvas.height);
    ctx.beginPath();
    ctx.moveTo(kanvas.width / 2, 0);
    ctx.lineTo(kanvas.width / 2 + x1 * 100, y1 * 100);
    ctx.lineTo(kanvas.width / 2 + x2 * 100, y2 * 100);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(kanvas.width / 2 + x1 * 100, y1 * 100, 10, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(kanvas.width / 2 + x2 * 100, y2 * 100, 10, 0, 2 * Math.PI);
    ctx.fill();
}


function generateECGSignal() {
    const data = [];
    const heartRates = [60, 70, 80, 90, 100, 110, 120];
    const heartRate = heartRates[Math.floor(Math.random() * heartRates.length)]; // Random heart rate
    const duration = 10; // Duration of the signal in seconds
    const sampleRate = 1000; // Samples per second
    const numSamples = duration * sampleRate;

    // Create a time array
    const time = Array.from({ length: numSamples }, (_, i) => i / sampleRate);

    // Generate a simplified ECG-like signal
    const rrInterval = 60 / heartRate; // RR interval in seconds
    const pWaveDuration = 0.1; // P wave duration in seconds
    const qrsDuration = 0.08; // QRS complex duration in seconds
    const tWaveDuration = 0.16; // T wave duration in seconds

    for (let t of time) {
        let signal = 0;

        // P wave
        if (t % rrInterval < pWaveDuration) {
            signal += 0.1 * Math.sin(2 * Math.PI * (1 / pWaveDuration) * (t % rrInterval));
        }

        // QRS complex
        if (t % rrInterval >= pWaveDuration && t % rrInterval < pWaveDuration + qrsDuration) {
            signal += 0.5 * Math.sin(2 * Math.PI * (1 / qrsDuration) * (t % rrInterval - pWaveDuration));
        }

        // T wave
        if (t % rrInterval >= pWaveDuration + qrsDuration && t % rrInterval < pWaveDuration + qrsDuration + tWaveDuration) {
            signal += 0.2 * Math.sin(2 * Math.PI * (1 / tWaveDuration) * (t % rrInterval - pWaveDuration - qrsDuration));
        }

        data.push(signal);
    }

    // Store the heart rate for checking the guess
    window.heartRate = heartRate;

    return data;
}

function savitzkyGolay(data, windowSize, polynomialOrder) {
    const halfWindow = Math.floor(windowSize / 2);
    const coefficients = [];
    const result = [];

    for (let i = -halfWindow; i <= halfWindow; i++) {
        let sum = 0;
        for (let j = 0; j <= polynomialOrder; j++) {
            sum += Math.pow(i, j);
        }
        coefficients.push(sum);
    }

    for (let i = 0; i < data.length; i++) {
        let sum = 0;
        for (let j = -halfWindow; j <= halfWindow; j++) {
            const index = i + j;
            if (index >= 0 && index < data.length) {
                sum += data[index] * coefficients[j + halfWindow];
            }
        }
        result.push(sum);
    }

    return result;
}

function performConvolution() {
    const ecgData = window.ecgData;
    // const reverse_ecgData = ecgData.slice().reverse();
    const windowSize = 5; // Adjust window size as needed
    const polynomialOrder = 2; // Adjust polynomial order as needed
    // const smoothedData = savitzkyGolay(ecgData, windowSize, polynomialOrder);
    const convolvedData = convolve(ecgData, ecgData);

    // Plot the smoothed data
    // var trace = {
        // x: Array.from({ length: smoothedData.length }, (_, i) => i / 1000), // Convert to seconds
    //     y: smoothedData,
    //     type: 'scatter',
    //     mode: 'line'
    // };

    // var layout = {
    //     title: 'Smoothed ECG Signal',
    //     showlegend: false,
    //     xaxis: {
    //         title: 'Time (s)'
    //     },
    //     yaxis: {
    //         title: 'Amplitude'
    //     }
    // };

    var trace = {
        x: Array.from({ length: convolvedData.length }, (_, i) => i / 1000), // Convert to seconds
        y: convolvedData,
        type: 'scatter',
        mode: 'line'
    }

    var layout = {
        title: 'Convolved Signal',
        showlegend: false,
        xaxis: {
            title: 'Time (s)'
        },
        yaxis: {
            title: 'Amplitude'
        }
    };

    var data = [trace];

    var config = { responsive: true }

    Plotly.newPlot('figure10', data, layout, config);

    // Store the smoothed data for peak detection
    window.convolvedData = convolvedData;
}
function convolve(signal, kernel) {
    const output = [];
    const halfKernel = Math.floor(kernel.length / 2);

    for (let i = 0; i < signal.length; i++) {
        let sum = 0;
        for (let j = 0; j < kernel.length; j++) {
            const signalIndex = i + j - halfKernel;
            if (signalIndex >= 0 && signalIndex < signal.length) {
                sum += signal[signalIndex] * kernel[j];
            }
        }
        output.push(sum);
    }

    return output;
}

function checkGuess() {
    const userGuess = parseInt(document.getElementById("userGuess").value);
    const convolvedData = window.convolvedData;

    // Define a threshold to filter out insignificant peaks
    const threshold = Math.max(...convolvedData) * 0.2;

    const peaks = [];
    for (let i = 1; i < convolvedData.length - 1; i++) {
        if (convolvedData[i] > convolvedData[i - 1] && convolvedData[i] > convolvedData[i + 1] && convolvedData[i] > threshold) {
            peaks.push(i);
        }
    }

    if (peaks.length < 2) {
        document.getElementById("result").innerHTML = `<h3>Not enough peaks detected to estimate heart rate.</h3>`;
        return;
    }

    const peakIntervals = [];
    for (let i = 1; i < peaks.length; i++) {
        const interval = peaks[i] - peaks[i - 1];
        const intervalInSeconds = interval / 1000; // Convert to seconds
        if (intervalInSeconds >= 0.5) { // Ignore intervals smaller than 0.5 seconds
            peakIntervals.push(interval);
        }
    }

    if (peakIntervals.length < 1) {
        document.getElementById("result").innerHTML = `<h3>Not enough valid peak intervals detected to estimate heart rate.</h3>`;
        return;
    }

    const averageInterval = peakIntervals.reduce((a, b) => a + b, 0) / peakIntervals.length;
    const averageIntervalInSeconds = averageInterval / 1000; // Convert to seconds
    const heartRateCalculated = 60 / averageIntervalInSeconds; // Converts to bpm

    console.log("Peaks:", peaks);
    console.log("Peak Intervals:", peakIntervals);
    console.log("Average Interval (ms):", averageInterval);
    console.log("Average Interval (s):", averageIntervalInSeconds);
    console.log("Calculated heart rate:", heartRateCalculated);

    const tolerance = 5; // Allowable error in bpm
    const resultDiv = document.getElementById("result");
    if (Math.abs(userGuess - heartRate) <= tolerance) {
        resultDiv.innerHTML = `<h3>Correct! The estimated heart rate is approximately ${Math.round(heartRate)} bpm.</h3>`;
    } else {
        resultDiv.innerHTML = `<h3>Incorrect. The estimated heart rate is approximately ${Math.round(heartRate)} bpm.</h3>`;
    }
}

function drawQuasiPendulum() {
    var trace1 = {
        x: toime,
        y: t1acc,
        type: 'scatter',
        mode: 'line'
    };

    var layout1 = {
        title: 'Angle of Pendulum 1',
        showlegend: false,
        xaxis: {
            title: 'Time (s)'
        },
        yaxis: {
            title: 'theta1'
        }
    };

    var data1 = [trace1];

    var config = { responsive: true }

    Plotly.newPlot('figure9', data1, layout1, config);
}

// -------------------------------- Toggle stop button ------------------------------------------------------------

function stopPendulum() {
    clearInterval(intID);
    ctx.clearRect(0, 0, kanvas.width, kanvas.height);
    kanvas.style.display = "none";
    document.getElementById("stop").style.display = "none";
}

function toggler(divId) {
    var x = document.getElementById(divId);
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function stopVisible() {
    toggler('stop');
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

function startup() {
    document.getElementById("default").click();
}


window.onload = startup;