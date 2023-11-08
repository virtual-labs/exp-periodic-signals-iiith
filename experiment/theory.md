
# Theory #
## Fourier transform ##

The Fourier transform of a discrete-time signal $\textbf{x}[n]$ is given by 

$$ X(\omega) = \sum_{n=-\infty}^{n=\infty} \textbf{x}[n] exp(-j \omega n).$$ 

This transform is a periodic function with period $2 \pi$, 

$$ X(\omega) = X(\omega + 2\pi) ~~\forall~~ \omega. $$

Due to this periodicity, it is sufficient to specify the transform in an interval of length $2\pi$, such as $[-\pi, \pi]$ or $[0, 2\pi]$. 

The complex sinusoidal signals $exp(-j \omega n)$ form the building blocks for any arbitrary signal $\textbf{x}[n]$ for $\omega \in [-\pi, \pi]$. Recall that, due to periodic nature of frequency in discrete-time signals, frequencies close to $0$ or $2\pi$ are ‘low’ frequencies showing slow variation over time while frequencies close to $\pi$ are ‘high’ frequencies exhibiting high variation with time.  

## Frequency response of LTI system ##
Discrete-time LTI systems can be characterised by their impulse response $\textbf{h}[n]$. An equivalent characterization is given by the Fourier transform of the impulse response, called the frequency response of the LTI system. This frequency response $H(\omega)$ is given by 

$$ H(\omega) = \sum_{n=-\infty}^{n=\infty} h[n] exp(-j \omega n). $$

The frequency response is a periodic function with period $2 \pi$. The frequency representation provides an alternate way of understanding LTI systems. We demonstrate this next by considering sinusoidal inputs to LTI systems. 

##  Eigenfunctions of LTI systems ##
In time domain, the output $\textbf{y}[n]$ of an LTI system is given by convolution of the input signal $\textbf{x}[n]$ and the impulse response $\textbf{h}[n]$ of the system. Using convolution property of Fourier transform,

$$ Y(\omega) = X(\omega) H(\omega) $$

Specifically, when the input signal is a single-frequency complex sinusoid, the output of the system is also a complex sinusoid with same frequency as the input signal. Hence the complex sinusoid signals are eigenfunctions of an LTI system giving, 

$$ exp(-j \omega_{0} n) \rightarrow H(\omega_{0}) exp(-j \omega_{0} n).  $$

The frequency response $H(\omega)$ captures the behaviour of the system in frequency domain. Thus, LTI systems act as frequency selective systems. 

## Magnitude and phase response ##

The frequency response is in general a complex-valued function. Alternately, it can be expressed using the magnitude and phase of the complex values. The magnitude response is $|H(\omega)|$ and the phase response is $\angle H(\omega)$. For a complex sinusoid with frequency $\omega_{0}$ we have, 

$$ exp(-j \omega_{0} n) \rightarrow |H(\omega_{0})| exp(-j [\omega_{0} n + \angle H(\omega)]).  $$

The output sinusoid has frequency $\omega_{0}$, magnitude $|H(\omega_0)|$, and a phase change of $\angle H(\omega_0)$. 

## Frequency response examples ##

Frequency response of some standard systems: 

* Delay: $H(\omega) = exp(-j \omega \Delta)$ 

* Scaling: $H(\omega) = \alpha $ 

* Differentiator: $H(\omega) = exp(-j \omega \Delta) - exp(-j \omega (\Delta-1)) $ 

* Accumulator: $H(\omega) = exp(j \omega \Delta) + exp(j \omega (\Delta+1)) $ 

* Identity: $H(\omega) $ 

Due to their frequency selective nature, LTI systems can be designed to allow or prohibit desired frequencies. Thus, LTI systems can act as filters of various types. Some commonly used filters are – low pass, high pass, band pass, and band stop filters. 
