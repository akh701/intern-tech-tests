import "../AdditionalFiles/App.css";
import React, { useState, useEffect } from "react";

//This is the API url to fetch from
const API_URL = "https://matchesfashion.com/api/products";
const TAX_RATE = 0.08;

function YourSolution() {
	const [products, setProducts] = useState([]);
	const [page, setPage] = useState(0);
	const [count, setCount] = useState();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		setLoading(true);
		fetch(API_URL + `?page=${page}`)
			.then(res => {
				return res.json();
			})
			.then(({ count, products }) => {
				setProducts(products);
				setCount(count);
				setLoading(false);
			})
			.catch(err => {
				setError("something went wrong");
				setLoading(false);
				return err;
			});
	}, [page]);

	const lastPage = Math.ceil(count / products.length);

	const handleClick = pageInc => {
		setPage(currentPage => currentPage + pageInc);
	};

	const TaxAfterProfit = (costToBusiness, soldPrice, quantitySold) => {
		const profit = soldPrice - costToBusiness;
		if (quantitySold >= 10) {
			const firstTenItemsProfit = profit * 10;
			const taxedIemsProfit = (quantitySold - 10) * profit * (1 - TAX_RATE);
			const profitAfterTax = firstTenItemsProfit + taxedIemsProfit;
			return (
				"£" +
				profitAfterTax.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
			);
		} else {
			const profitAfterTax = quantitySold * profit;
			return (
				"£" +
				profitAfterTax.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
			);
		}
	};

	if (loading) return <h2>Loading ...</h2>;

	if (error) return <h1>{error}</h1>;

	return (
		<div className='App'>
			<table id='products'>
				<thead>
					<tr>
						<th>Id</th>
						<th>Brand</th>
						<th>Name</th>
						<th>Quantity Sold</th>
						<th>Sold Price</th>
						<th>Cost To Business</th>
						<th>Profit after Tax</th>
					</tr>
				</thead>
				<tbody>
					{products.map(product => {
						return (
							<tr key={product.id}>
								<td>{product.id}</td>
								<td>{product.brand}</td>
								<td>{product.name}</td>
								<td>{product.quantitySold}</td>
								<td>{product.soldPrice}</td>
								<td>{product.costToBusiness}</td>
								<td>
									{TaxAfterProfit(
										product.costToBusiness,
										product.soldPrice,
										product.quantitySold
									)}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			<button disabled={page === 0} onClick={() => setPage(0)}>
				First Page
			</button>
			<button disabled={page === 0} onClick={() => handleClick(-1)}>
				Previous Page
			</button>
			<button disabled={products.length === 0} onClick={() => handleClick(1)}>
				Next Page
			</button>
			<button
				disabled={products.length === 0}
				onClick={() => setPage(lastPage)}
			>
				Last Page
			</button>
		</div>
	);
}

export default YourSolution;
