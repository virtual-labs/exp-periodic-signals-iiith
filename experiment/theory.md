# Fourier series of periodic signals

Any periodic signal can be represented in terms of sine and cosines or their harmonics. We can verify that any two signals in this set are orthogonal as discussed in experiment 1.

1. Fourier Series Analysis: Given periodic signal x(t) with time period T, find the Fourier coefficient

   $$x(t) \rightarrow \{a_k, b_k\}$$

2. Fourier Series Synthesis: Given Fourier series coefficients, reconstruct the periodic signal $x(t)$

Let $x(t)$ be a periodic signal with time period $(T=\frac{2 \pi}{\omega_0})$ and its Fourier Series coefficients are given as $\{a_k, b_k\}$, where

$$a_k = \frac{2}{T} \int_{<T>} x(t) \cos (k \omega_0 t) dt~~~~~~~k=1,2,...,\infty$$

$$b_k = \frac{2}{T} \int_{<T>} x(t) \sin (k \omega_0 t) dt~~~~~~~k=1,2,...,\infty$$

$$a_0 = \frac{1}{T} \int_{<T>} x(t)  dt~~~~~~~\text{(average value of signal in one period)}$$

The signal $x(t)$ can be approximately/partially reconstructed using Fourier series coefficients $\{a_k,b_k\}$ where $ k = 0,1, .. ~R $

$$\hat{x}(t) = a_0 + \sum_{k=1}^{R} a_k \cos (2\pi k f_0 t) + \sum_{k=1}^{R} b_k \sin (2\pi k f_0 t)$$

Now the reconstruction error can be given as

$$ e(t) = x(t) - \hat{x}(t) $$

The set of signals $\{1, ~\cos (k \omega_0 t), ~\sin (k \omega_0 t)  \}_{k=0,1,..,\infty}$ forms a basis for space of periodic signals with time-period $T = \frac{1}{F_0} = \frac{2\pi}{\omega_0}$

$${x}(t) = a_0 + \sum_{k=1}^{\infty} a_k \cos (k \omega_0 t) + \sum_{k=1}^{\infty} b_k \sin (2\pi k \omega_0 t)$$

For real-valued signals $x(t)$, the coefficients $\{a_k, b_k\}$ are real valued

## Example:

Compute Fourier series coefficients of the square wave below:

 <p align="center"><img src=".\images\squarewave.png" alt="drawing" width="300"/>

$$
x(t) = \left\{\begin{matrix}
3 \quad 0 < t < 5\\
-3 \quad 5 < t < 10
\end{matrix}\right.
$$

Solution:

$a_0 = \frac{1}{T} \int_{0}^{T} x(t)  dt = ~0$

$a_k = \frac{2}{T} \int_{\frac{-T}{2}} ^ {\frac{T}{2}} x(t) \cos (k \omega_0 t) dt \\ ~~~~~=\frac{2}{10} \int_{-5} ^ {5} x(t) \cos (k \omega_0 t) dt \\  ~~~~~=\frac{1}{5} [\int_{-5} ^ {0} x(t) \cos (k \omega_0 t) dt +  \int_{0} ^ {5} x(t) \cos (k \omega_0 t) dt] \\ ~~~~~=\frac{1}{5} [-3 \int_{-5} ^ {0}  \cos (k \omega_0 t) dt + 3 \int_{0} ^ {5} \cos (k \omega_0 t) dt] \\ ~~~~~= 0$

$a_k = 0 ~\forall~~ k = 1, 2 ...\infty $

since $x(t)$ is an odd signal, we get $a_k = 0$, which shows that there are no cosine terms in the Fourier representation of $x(t)$.

$b_k = \frac{2}{T} \int_{\frac{-T}{2}} ^ {\frac{T}{2}} x(t) \sin (k \omega_0 t) dt ~~~~~\text{where} ~~\omega_0 = \frac{2 \pi} {10}   \\ ~~~~~=\frac{2}{10} \int_{-5} ^ {5} x(t) \sin (k \omega_0 t) dt \\  ~~~~~=\frac{1}{5} [\int_{-5} ^ {0} x(t) \sin (k \omega_0 t) dt +  \int_{0} ^ {5} x(t) \sin (k \omega_0 t) dt] \\ ~~~~~=\frac{1}{5} [-3 \int_{-5} ^ {0}  \sin (k \omega_0 t) dt + 3 \int_{0} ^ {5} \sin (k \omega_0 t) dt]\\ ~~~~~= \frac{3}{k \pi} [1 - 2 \cos (k \pi) + \cos (2k \pi)]\\ ~~~~~= \frac{6}{k \pi} [1 - \cos (k \pi)] \\ ~~~~~= \frac{6}{k \pi} [1 - (-1)^k]$
$$
b_k = \begin{cases}
\frac{12}{k\pi} & \text{if } k \text{ is odd} \\
0 & \text{if } k \text{ is even}
\end{cases}
$$

Now $x(t)$ can be represented as

$x(t) = \sum_{k=2r -1}^{r = 1,..\infty} \frac{12}{k\pi} \sin(k \omega_0 t)$
